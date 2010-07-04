package dk.in2isoft.onlineobjects.apps.videosharing.util;

import java.util.Collection;
import java.util.Date;

public class UserProfileInfo {

	private String fullName;
	private Boolean sex;
	private String resume;
	private String city;
	private Date birthday;
	private Collection<String> interests;
	private Collection<String> music;
	private Collection<String> tracks;
	
	
	public UserProfileInfo() {
		
	}

	public Boolean getSex() {
		return sex;
	}

	public void setSex(Boolean sex) {
		this.sex = sex;
	}

	public Collection<String> getInterests() {
		return interests;
	}

	public void setInterests(Collection<String> interests) {
		this.interests = interests;
	}

	public Collection<String> getMusic() {
		return music;
	}

	public void setMusic(Collection<String> music) {
		this.music = music;
	}
	public void setResume(String resume) {
		this.resume = resume;
	}

	public String getResume() {
		return resume;
	}
	
	public Collection<String> getTracks() {
		return tracks;
	}
	
	public void setTracks(Collection<String> tracks) {
		this.tracks = tracks;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getFullName() {
		return fullName;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getCity() {
		return city;
	}

	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}

	public Date getBirthday() {
		return birthday;
	}
}