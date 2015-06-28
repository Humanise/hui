package dk.in2isoft.onlineobjects.ui.jsf;


public abstract class ListModel <T> {

	private int pageSize = 20;
	private int page = 0;

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPage(int page) {
		this.page = page;
	}

	public int getPage() {
		return page;
	}

	public abstract ListModelResult<T> getResult();
}
