package dk.in2isoft.onlineobjects.service.authentication.perspectives;

public class UserInfoPerspective {

	private String fullName;
	private String username;
	private long photoId;

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public long getPhotoId() {
		return photoId;
	}

	public void setPhotoId(long id) {
		this.photoId = id;
	}
}
