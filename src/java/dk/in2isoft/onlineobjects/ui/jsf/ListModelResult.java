package dk.in2isoft.onlineobjects.ui.jsf;

import java.util.List;

public class ListModelResult<T> {

	private List<T> list;

	private int totalCount;

	public ListModelResult(List<T> list, int totalCount) {
		super();
		this.setList(list);
		this.setTotalCount(totalCount);
	}

	public void setList(List<T> list) {
		this.list = list;
	}

	public List<T> getList() {
		return list;
	}

	public void setTotalCount(int totalCount) {
		this.totalCount = totalCount;
	}

	public int getTotalCount() {
		return totalCount;
	}

}
