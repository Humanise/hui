package dk.in2isoft.onlineobjects.apps.reader.perspective;

public class FeedPerspective {

	private String title;
	private long id;
	
	public FeedPerspective(String title, long id) {
		this.title = title;
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
}
