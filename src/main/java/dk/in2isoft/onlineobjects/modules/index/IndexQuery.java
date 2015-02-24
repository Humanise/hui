package dk.in2isoft.onlineobjects.modules.index;

public class IndexQuery {

	protected String text;
	protected int page;
	protected int pageSize;

	public IndexQuery() {
		super();
	}

	public int getPage() {
		return this.page;
	}

	public int getPageSize() {
		return this.pageSize;
	}

	public String getText() {
		return text;
	}

}