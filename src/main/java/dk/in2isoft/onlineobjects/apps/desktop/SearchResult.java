package dk.in2isoft.onlineobjects.apps.desktop;

public class SearchResult {

	private String title;
	private long id;
	private String type;
	
	public SearchResult(String title, String type, long id) {
		super();
		this.title = title;
		this.id = id;
		this.type = type;
	}

	public SearchResult() {
		super();
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

}
