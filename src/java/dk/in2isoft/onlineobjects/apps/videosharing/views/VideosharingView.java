package dk.in2isoft.onlineobjects.apps.videosharing.views;

import java.util.List;

import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.UserQuery;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Video;
import dk.in2isoft.onlineobjects.modules.video.VideoService;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.FileService;

public class VideosharingView extends AbstractManagedBean {
	
	private ModelService modelService;
	private ConfigurationService configurationService;
	private FileService fileService;
	private VideoService videoService;
	
	public List<VideoInfo> getLatestVideos() {
		Query<Video> query = Query.of(Video.class).orderByCreated().descending();
		return videoService.buildVideoInfoList(query);
	}
	
	public List<Pair<User, Person>> getUsersList() {
		UserQuery query = new UserQuery();
		return modelService.searchPairs(query).getResult();
	}

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
