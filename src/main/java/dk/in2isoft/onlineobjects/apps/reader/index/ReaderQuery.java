package dk.in2isoft.onlineobjects.apps.reader.index;

import java.util.Collection;
import java.util.List;

import dk.in2isoft.onlineobjects.modules.index.IndexQuery;

public class ReaderQuery extends IndexQuery {

	private Collection<String> type;
	private String subset;
	private List<Long> wordIds;
	private List<Long> authorIds;

	public void setText(String text) {
		this.text = text;
	}

	public Collection<String> getType() {
		return type;
	}

	public void setType(Collection<String> type) {
		this.type = type;
	}

	public String getSubset() {
		return subset;
	}

	public void setSubset(String subset) {
		this.subset = subset;
	}

	public void setPage(int page) {
		this.page = page;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public List<Long> getWordIds() {
		return wordIds;
	}

	public void setWordIds(List<Long> wordIds) {
		this.wordIds = wordIds;
	}

	public List<Long> getAuthorIds() {
		return authorIds;
	}

	public void setAuthorIds(List<Long> authorIds) {
		this.authorIds = authorIds;
	}

}
