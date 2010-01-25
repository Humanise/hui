package dk.in2isoft.onlineobjects.apps.videosharing.views;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.core.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.UserQuery;
import dk.in2isoft.onlineobjects.model.Comment;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Video;
import dk.in2isoft.onlineobjects.modules.video.VideoService;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.FileService;

public class VideoView extends AbstractManagedBean implements InitializingBean {
	
	private ModelService modelService;
	private ConfigurationService configurationService;
	private FileService fileService;
	private VideoService videoService;
	private Person person;
	private User user;
	private Video video;
	private List<Comment> comments;

	public void afterPropertiesSet() throws Exception {
		String[] localPath = getRequest().getLocalPath();
		UserQuery query = new UserQuery().withUsername(localPath[1]);
		List<Pair<User,Person>> result = modelService.searchPairs(query).getResult();
		if (result.size()>0) {
			person = result.get(0).getValue();
			user = result.get(0).getKey();
		} else {
			throw new ContentNotFoundException();
		}
		long id = Long.parseLong(localPath[2]);
		video = modelService.get(Video.class, id);
		if (video==null) {
			throw new ContentNotFoundException();
		}
		Query<Comment> commentQuery = Query.of(Comment.class).withParent(video).orderByCreated().descending();
		comments = modelService.list(commentQuery);
	}
	
	public Date getNow() {
		return new Date();
	}
	
	public User getUser() {
		return user;
	}
	
	public Person getPerson() {
		return person;
	}
	
	public VideoInfo getVideoInfo() {
		return videoService.getInfo(video);
	}
	
	public List<Comment> getComments() {
		return comments;
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

	public VideoService getVideoService() {
		return videoService;
	}

}
