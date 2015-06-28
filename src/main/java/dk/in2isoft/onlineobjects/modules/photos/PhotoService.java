package dk.in2isoft.onlineobjects.modules.photos;

import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.apache.lucene.queryparser.flexible.standard.QueryParserUtil;
import org.apache.lucene.search.BooleanClause.Occur;
import org.apache.lucene.search.BooleanQuery;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.ExplodingClusterFuckException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.modules.index.IndexManager;
import dk.in2isoft.onlineobjects.modules.index.IndexUtil;

public class PhotoService {
	
	private IndexManager indexManager;
	private ModelService modelService;
	private SecurityService securityService;

	public SearchResult<Image> search(PhotoIndexQuery query) {
		Query<Image> modelQuery = Query.of(Image.class).withPaging(query.getPage(), query.getPageSize()).orderByCreated().descending();
		try {
			BooleanQuery combined = new BooleanQuery();
			Privileged owner = query.getOwner();
			if (owner!=null) {
				combined.add(IndexUtil.newLongQuery("ownerId", owner.getIdentity()), Occur.MUST);
			}
			Privileged viewer = query.getViewer();
			Collection<Long> viewers = Lists.newArrayList();
			viewers.add(securityService.getPublicUser().getId());
			
			if (viewer!=null) {
				viewers.add(query.getViewer().getIdentity());
			}
			combined.add(IndexUtil.newLongQuery("viewerId", viewers), Occur.MUST);
			String text = query.getText();
			if (Strings.isNotBlank(text)) {
				String indexQuery = "(text:"+QueryParserUtil.escape(text)+"* OR word:"+QueryParserUtil.escape(text)+"*)";
				combined.add(indexManager.buildQuery(indexQuery), Occur.MUST);
			}
			Set<Long> wordIds = query.getWordIds();
			if (Code.isNotEmpty(wordIds)) {
				combined.add(IndexUtil.newLongQuery("wordId", wordIds), Occur.MUST);
			}
			
			List<Long> ids = indexManager.getIds(combined, 0, 2000);
			if (ids.isEmpty()) {
				ids.add(-1l);
			}
			modelQuery.withIds(ids);
		} catch (ExplodingClusterFuckException e) {
			return null;
		}
		//if (!modifiable) {
			//query.withPublicView();
		//}
		//query.withPrivileged(user);
		return modelService.search(modelQuery);
	}
	
	// Wiring...
	
	public void setIndexManager(IndexManager indexManager) {
		this.indexManager = indexManager;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
}
