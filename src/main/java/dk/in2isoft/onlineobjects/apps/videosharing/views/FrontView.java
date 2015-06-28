package dk.in2isoft.onlineobjects.apps.videosharing.views;

import java.util.List;

import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.model.Video;
import dk.in2isoft.onlineobjects.modules.video.VideoService;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.FileService;

public class FrontView extends AbstractManagedBean implements InitializingBean {
	
	private ModelService modelService;
	private ConfigurationService configurationService;
	private FileService fileService;
	private VideoService videoService;
	private VideoInfo latestVideo;
	private List<VideoInfo> latestVideos;

	public void afterPropertiesSet() throws Exception {
		Query<Video> q = Query.of(Video.class).orderByCreated().descending();
		latestVideos = videoService.buildVideoInfoList(q,getRequest());
		latestVideos = latestVideos.subList(0, Math.min(latestVideos.size(), 8));
	}
	
	public VideoInfo getLatestVideo() {
		return latestVideo;
	}
	
	public List<VideoInfo> getLatestVideos() {
		return latestVideos;
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
