package dk.in2isoft.onlineobjects.apps.reader;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import com.google.common.collect.LinkedListMultimap;
import com.google.common.collect.ListMultimap;
import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.apps.reader.index.ReaderQuery;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.ExplodingClusterFuckException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Hypothesis;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Question;
import dk.in2isoft.onlineobjects.model.Statement;
import dk.in2isoft.onlineobjects.modules.index.IndexManager;
import dk.in2isoft.onlineobjects.modules.index.IndexSearchQuery;
import dk.in2isoft.onlineobjects.modules.index.IndexSearchResult;
import dk.in2isoft.onlineobjects.modules.index.IndexService;
import dk.in2isoft.onlineobjects.ui.Request;

public class ReaderSearcher {

	private ModelService modelService;
	private IndexService indexService;
	
	public SearchResult<Entity> search(Request request, int page, int pageSize) throws ExplodingClusterFuckException, SecurityException {
		ReaderQuery readerQuery = new ReaderQuery();
		readerQuery.setText(request.getString("text"));
		readerQuery.setSubset(request.getString("subset"));
		readerQuery.setType(request.getStrings("type"));
		readerQuery.setPage(page);
		readerQuery.setPageSize(pageSize);
		readerQuery.setWordIds(request.getLongs("tags"));
		readerQuery.setAuthorIds(request.getLongs("authors"));
		UserSession session = request.getSession();
		
		return search(readerQuery, session);
	}

	public SearchResult<Entity> search(ReaderQuery readerQuery, Privileged privileged) throws ExplodingClusterFuckException, SecurityException {
		if (privileged==null) {
			throw new SecurityException("No privileged provided");
		}
		final ListMultimap<String, Long> idsByType = find(privileged, readerQuery);
		final List<Long> ids = Lists.newArrayList(idsByType.values());

		List<Entity> list = Lists.newArrayList();
		{
			List<Long> addressIds = idsByType.get(InternetAddress.class.getSimpleName().toLowerCase());
			if (!addressIds.isEmpty()) {
				Query<InternetAddress> query = Query.after(InternetAddress.class).withIds(addressIds).withPrivileged(privileged);

				list.addAll(modelService.list(query));
			}
		}
		{
			List<Long> partIds = idsByType.get(Statement.class.getSimpleName().toLowerCase());
			if (!partIds.isEmpty()) {
				Query<Statement> query = Query.after(Statement.class).withIds(partIds).withPrivileged(privileged);

				list.addAll(modelService.list(query));
			}
		}
		{
			List<Long> partIds = idsByType.get(Question.class.getSimpleName().toLowerCase());
			if (!partIds.isEmpty()) {
				Query<Question> query = Query.after(Question.class).withIds(partIds).withPrivileged(privileged);

				list.addAll(modelService.list(query));
			}
		}
		{
			List<Long> partIds = idsByType.get(Hypothesis.class.getSimpleName().toLowerCase());
			if (!partIds.isEmpty()) {
				Query<Hypothesis> query = Query.after(Hypothesis.class).withIds(partIds).withPrivileged(privileged);

				list.addAll(modelService.list(query));
			}
		}

		sortByIds(list, ids);

		int totalCount = idsByType.get("total").iterator().next().intValue(); // TODO
		
		
		return new SearchResult<>(list, totalCount);
	}

	private void sortByIds(List<Entity> list, final List<Long> ids) {
		Collections.sort(list, new Comparator<Entity>() {

			public int compare(Entity o1, Entity o2) {
				int index1 = ids.indexOf(o1.getId());
				int index2 = ids.indexOf(o2.getId());
				if (index1 > index2) {
					return 1;
				} else if (index2 > index1) {
					return -1;
				}
				return 0;
			}
		});
	}

	private ListMultimap<String, Long> find(Privileged privileged, ReaderQuery query) throws ExplodingClusterFuckException {
		IndexManager index = getIndex(privileged);
		if (Strings.isBlank(query.getText()) && Strings.isBlank(query.getSubset())) {
			ListMultimap<String, Long> idsByType = index.getIdsByType();
			idsByType.put("total",Long.valueOf(idsByType.size()));
			return idsByType;
		}
		final ListMultimap<String, Long> ids = LinkedListMultimap.create();

		IndexSearchQuery indexQuery = new IndexSearchQuery(ReaderQuery.build(query));
		indexQuery.setPage(query.getPage());
		indexQuery.setPageSize(query.getPageSize());
		if (Strings.isBlank(query.getText())) {
			indexQuery.addLongOrdering("created",true);
		}
		SearchResult<IndexSearchResult> search = index.search(indexQuery);
		for (IndexSearchResult row : search.getList()) {
			Long id = row.getLong("id");
			String type = row.getString("type");
			ids.put(type, id);
		}
		ids.put("total", Long.valueOf(search.getTotalCount()));
		return ids;
	}

	private IndexManager getIndex(Privileged privileged) {
		return indexService.getIndex("app-reader-user-" + privileged.getIdentity());
	}
	
	// Wiring...
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setIndexService(IndexService indexService) {
		this.indexService = indexService;
	}
}
