package dk.in2isoft.onlineobjects.service.authentication.perspectives;

import java.util.List;

import dk.in2isoft.onlineobjects.ui.data.Option;

public class UserInfoPerspective {

	private String fullName;
	private String username;
	private List<Option> links;
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

	public List<Option> getLinks() {
		return links;
	}

	public void setLinks(List<Option> links) {
		this.links = links;
	}
}
