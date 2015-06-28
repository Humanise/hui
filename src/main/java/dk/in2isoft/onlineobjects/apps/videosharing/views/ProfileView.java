package dk.in2isoft.onlineobjects.apps.videosharing.views;

import java.util.List;

import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.UserQuery;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Address;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Video;
import dk.in2isoft.onlineobjects.modules.video.VideoService;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.FileService;
import dk.in2isoft.onlineobjects.services.PersonService;

public class ProfileView extends AbstractManagedBean implements InitializingBean {
	
	private ModelService modelService;
	private ConfigurationService configurationService;
	private FileService fileService;
	private VideoService videoService;
	private PersonService personService;
	private Person person;
	private User user;
	private List<VideoInfo> usersVideos;
	private Image image;
	private String city;

	public void afterPropertiesSet() throws Exception {
		String[] localPath = getRequest().getLocalPath();
		UserQuery query = new UserQuery().withUsername(localPath[1]);
		List<Pair<User,Person>> result = modelService.searchPairs(query).getList();
		if (result.size()==0) {
			throw new ContentNotFoundException("The user does not exist");
		}
		person = result.get(0).getValue();
		user = result.get(0).getKey();
		image = modelService.getChild(user, Relation.KIND_SYSTEM_USER_IMAGE, Image.class);
		
		Query<Video> q = Query.of(Video.class).withPrivileged(user).orderByCreated().descending();
		this.usersVideos = videoService.buildVideoInfoList(q,getRequest());
		
		Address address = personService.getPersonsPreferredAddress(person);
		if (address!=null) {
			this.city = address.getCity();
		}

	}
	
	public boolean isCanModify() {
		return user.getIdentity()==getRequest().getSession().getIdentity();
	}
	
	public User getUser() {
		return user;
	}
	
	public Person getPerson() {
		return person;
	}
	
	public Image getImage() {
		return image;
	}
	
	public String getCity() {
		return city;
	}
	
	public Integer getAge() {
		return personService.getYearsOld(person);
	}
	
	public List<VideoInfo> getUsersVideos() throws ModelException {
		return usersVideos;
	}
	
	public List<String> getMusicInterests() {
		return person.getPropertyValues(Property.KEY_HUMAN_FAVORITE_MUSIC);
	}
	
	public List<String> getOtherInterests() {
		return person.getPropertyValues(Property.KEY_HUMAN_INTEREST);
	}
	
	public List<String> getTrackInterests() {
		return person.getPropertyValues(Property.KEY_HUMAN_FAVORITE_MUSIC_TRACK);
	}
	
	////////////////// Services ////////////////////

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public ModelService getModelService() {
		return modelService;
	}

	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}

	public ConfigurationService getConfigurationService() {
		return configurationService;
	}

	public void setFileService(FileService fileService) {
		this.fileService = fileService;
	}

	public FileService getFileService() {
		return fileService;
	}

	public void setVideoService(VideoService videoService) {
		this.videoService = videoService;
	}

	public void setPersonService(PersonService personService) {
		this.personService = personService;
	}

}
