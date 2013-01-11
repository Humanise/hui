package dk.in2isoft.onlineobjects.apps.videosharing.remoting;

import java.util.List;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.onlineobjects.apps.community.services.MemberService;
import dk.in2isoft.onlineobjects.apps.videosharing.util.UserProfileInfo;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Address;
import dk.in2isoft.onlineobjects.model.Comment;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Video;
import dk.in2isoft.onlineobjects.modules.video.VideoService;
import dk.in2isoft.onlineobjects.services.PersonService;
import dk.in2isoft.onlineobjects.services.RatingService;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;

public class VideosharingRemotingFacade extends AbstractRemotingFacade {

	private VideoService videoService;
	private SecurityService securityService;
	private RatingService ratingService;
	private PersonService personService;
	private MemberService memberService;

	public void addComment(long id, String name, String text) throws ModelException, IllegalRequestException {
		Video video = modelService.get(Video.class, id, getUserSession());
		if (video == null) {
			throw new IllegalRequestException("The video could not be found", "videoNotFound");
		}
		if (StringUtils.isBlank(name)) {
			throw new IllegalRequestException("The name is empty", "noName");
		}
		if (StringUtils.isBlank(text)) {
			throw new IllegalRequestException("The text is empty", "noText");
		}
		if (text.length() > 4000) {
			throw new IllegalRequestException("The text is too long", "tooLongText");
		}
		Privileged owner = modelService.getOwner(video);
		if (owner == null) {
			owner = getUserSession();
		}
		Comment comment = new Comment();
		comment.setName(name);
		comment.setText(text);
		modelService.createItem(comment, owner);
		modelService.createRelation(video, comment, owner);
	}

	public void rateVideo(long id, double rate) throws EndUserException {
		if (isPublicUser()) {
			throw new SecurityException("Not allowed");
		}
		Video video = modelService.get(Video.class, id, getUserSession());
		if (video == null) {
			throw new IllegalRequestException("The video could not be found", "videoNotFound");
		}
		ratingService.rate(video, rate, getUserSession().getUser());
	}

	public void rateVideoAdditive(long id, double rate) throws EndUserException {
		if (isPublicUser()) {
			throw new SecurityException("Not allowed");
		}
		Video video = modelService.get(Video.class, id, getUserSession());
		if (video == null) {
			throw new IllegalRequestException("The video could not be found", "videoNotFound");
		}
		ratingService.rateAdditive(video, rate, getUserSession().getUser());
	}

	private boolean isPublicUser() {
		return SecurityService.PUBLIC_USERNAME.equals(getUserSession().getUser().getUsername());
	}

	public void addVideoFromUrl(String title, String url) throws EndUserException {
		if (!videoService.isSupportedVideoUrl(url)) {
			throw new IllegalRequestException("The address is not supported", "notSupported");
		}
		videoService.createVideoFromUrl(title, url, getUserSession());
	}

	public void removeVideo(long id) throws EndUserException {
		Video video = modelService.get(Video.class, id, getUserSession());
		if (video == null) {
			throw new IllegalRequestException("The video could not be found", "notFound");
		}
		List<Entity> children = modelService.getChildren(video, Entity.class);
		for (Entity entity : children) {
			modelService.deleteEntity(entity, getUserSession());
		}
		modelService.deleteEntity(video, getUserSession());
	}

	public UserProfileInfo getProfileInfo() throws EndUserException {
		UserProfileInfo info = new UserProfileInfo();
		Person person = personService.getUsersMainPerson(getUserSession().getUser());
		if (person == null) {
			throw new EndUserException("The user does not have a person!");
		}
		info.setFullName(person.getFullName());
		info.setSex(person.getSex());
		info.setBirthday(person.getBirthday());
		info.setResume(person.getPropertyValue(Property.KEY_HUMAN_RESUME));
		info.setInterests(person.getPropertyValues(Property.KEY_HUMAN_INTEREST));
		info.setMusic(person.getPropertyValues(Property.KEY_HUMAN_FAVORITE_MUSIC));
		info.setTracks(person.getPropertyValues(Property.KEY_HUMAN_FAVORITE_MUSIC_TRACK));
		Address address = personService.getPersonsPreferredAddress(person);
		if (address != null) {
			info.setCity(address.getCity());
		}
		return info;
	}

	public void updateProfileInfo(UserProfileInfo info) throws EndUserException {
		Person person = personService.getUsersMainPerson(getUserSession().getUser());
		if (person == null) {
			throw new EndUserException("The user does not have a person!");
		}
		person.setFullName(info.getFullName());
		person.setSex(info.getSex());
		person.overrideFirstProperty(Property.KEY_HUMAN_RESUME, info.getResume());
		person.overrideProperties(Property.KEY_HUMAN_INTEREST, info.getInterests());
		person.overrideProperties(Property.KEY_HUMAN_FAVORITE_MUSIC, info.getMusic());
		person.overrideProperties(Property.KEY_HUMAN_FAVORITE_MUSIC_TRACK, info.getTracks());
		person.setBirthday(info.getBirthday());
		Address address = new Address();
		address.setCity(info.getCity());
		personService.updatePersonsPreferredAddress(person, address, getUserSession());
		modelService.updateItem(person, getUserSession());
	}
	
	public void signUp(String fullName, String email, String username, String password) throws EndUserException {
		memberService.signUp(getUserSession(), username, password, fullName, email);
	}

	// Services

	public void setVideoService(VideoService videoService) {
		this.videoService = videoService;
	}

	public VideoService getVideoService() {
		return videoService;
	}

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}

	public SecurityService getSecurityService() {
		return securityService;
	}

	public void setRatingService(RatingService ratingService) {
		this.ratingService = ratingService;
	}

	public RatingService getRatingService() {
		return ratingService;
	}

	public void setPersonService(PersonService personService) {
		this.personService = personService;
	}
	
	public void setMemberService(MemberService memberService) {
		this.memberService = memberService;
	}
}
