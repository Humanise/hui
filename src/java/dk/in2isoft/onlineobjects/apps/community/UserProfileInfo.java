package dk.in2isoft.onlineobjects.apps.community;

import java.util.Collection;
import java.util.List;

import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.PhoneNumber;

public class UserProfileInfo {
	
	private long userId;

	private String givenName;

	private String familyName;

	private String additionalName;

	private Boolean sex;
	
	private String resume;

	private Collection<String> interests;
	private Collection<String> music;
	private Collection<String> movies;
	private Collection<String> books;
	private Collection<String> televisionPrograms;
	private List<EmailAddress> emails;
	private List<PhoneNumber> phones;
	private List<InternetAddress> urls;

	public UserProfileInfo() {
		
	}

	public String getGivenName() {
		return givenName;
	}

	public void setGivenName(String givenName) {
		this.givenName = givenName;
	}

	public String getFamilyName() {
		return familyName;
	}

	public void setFamilyName(String familyName) {
		this.familyName = familyName;
	}

	public String getAdditionalName() {
		return additionalName;
	}

	public void setAdditionalName(String additionalName) {
		this.additionalName = additionalName;
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

	public Collection<String> getMovies() {
		return movies;
	}

	public void setMovies(Collection<String> movies) {
		this.movies = movies;
	}

	public Collection<String> getBooks() {
		return books;
	}

	public void setBooks(Collection<String> books) {
		this.books = books;
	}

	public Collection<String> getTelevisionPrograms() {
		return televisionPrograms;
	}

	public void setTelevisionPrograms(Collection<String> televisionSeries) {
		this.televisionPrograms = televisionSeries;
	}

	public void setResume(String resume) {
		this.resume = resume;
	}

	public String getResume() {
		return resume;
	}

	public void setEmails(List<EmailAddress> emails) {
		this.emails = emails;
	}

	public List<EmailAddress> getEmails() {
		return emails;
	}

	public void setPhones(List<PhoneNumber> phones) {
		this.phones = phones;
	}

	public List<PhoneNumber> getPhones() {
		return phones;
	}

	public void setUrls(List<InternetAddress> urls) {
		this.urls = urls;
	}

	public List<InternetAddress> getUrls() {
		return urls;
	}

	public long getUserId() {
		return userId;
	}

	public void setUserId(long userId) {
		this.userId = userId;
	}

}