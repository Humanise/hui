package dk.in2isoft.onlineobjects.apps.reader.perspective;


public class HypothesisViewPerspective implements CategorizableViewPerspective {

	private long id;
	private String text;
	private String rendering;
	private boolean inbox;
	private boolean favorite;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getRendering() {
		return rendering;
	}

	public void setRendering(String rendering) {
		this.rendering = rendering;
	}

	public boolean isInbox() {
		return inbox;
	}

	public void setInbox(boolean inbox) {
		this.inbox = inbox;
	}

	public boolean isFavorite() {
		return favorite;
	}

	public void setFavorite(boolean favorite) {
		this.favorite = favorite;
	}
}
