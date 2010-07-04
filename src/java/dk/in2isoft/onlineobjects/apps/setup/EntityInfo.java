package dk.in2isoft.onlineobjects.apps.setup;

public class EntityInfo {

	private long id;
	private boolean publicAlter;
	private boolean publicView;
	private boolean publicDelete;

	public void setPublicAlter(boolean publicAlter) {
		this.publicAlter = publicAlter;
	}

	public boolean isPublicAlter() {
		return publicAlter;
	}

	public void setPublicView(boolean publicView) {
		this.publicView = publicView;
	}

	public boolean isPublicView() {
		return publicView;
	}

	public void setPublicDelete(boolean publicDelete) {
		this.publicDelete = publicDelete;
	}

	public boolean isPublicDelete() {
		return publicDelete;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getId() {
		return id;
	}

}
