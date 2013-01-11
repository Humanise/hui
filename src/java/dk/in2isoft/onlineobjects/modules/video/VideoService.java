package dk.in2isoft.onlineobjects.modules.video;

import java.io.File;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.http.URLUtil;
import dk.in2isoft.commons.util.AbstractCommandLineInterface;
import dk.in2isoft.onlineobjects.apps.videosharing.views.VideoInfo;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Video;
import dk.in2isoft.onlineobjects.modules.youtube.YouTubeService;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.FileService;
import dk.in2isoft.onlineobjects.services.StorageService;
import dk.in2isoft.onlineobjects.ui.Request;

public class VideoService extends AbstractCommandLineInterface {

	//private static Logger log = Logger.getLogger(VideoService.class);
	
	private StorageService storageService;
	private ConfigurationService configurationService;
	private FileService fileService;
	private ModelService modelService;
	private YouTubeService youTubeService;

	public VideoService() {
	}

	public void changeImageFile(Video image, File file,String contentType)
	throws EndUserException {
		image.setContentType(contentType);
		image.setFileSize(file.length());
		File folder = storageService.getItemFolder(image);
		file.renameTo(new File(folder,"original"));
	}

	public File getVideoFile(Video video) {
		File folder = storageService.getItemFolder(video);
		return new File(folder,"original");
	}

	public String getFileName(Video video) {
		return fileService.getSafeFileName(video.getName(), fileService.getExtensionForMimeType(video.getContentType()));
	}

	public List<VideoInfo> buildVideoInfoList(Query<Video> query, Request request) throws ModelException {
		List<VideoInfo> out = Lists.newArrayList();
		List<Video> list = modelService.list(query);
		for (Video video : list) {
			out.add(getInfo(video, request));
		}
		return out;

	}

	public VideoInfo getInfo(Video video, Request request) throws ModelException {
		VideoInfo info = new VideoInfo();
		info.setBaseContext(request.getBaseContext());
		info.setId(video.getId());
		info.setTitle(video.getName());
		info.setCreated(video.getCreated());
		if (StringUtils.isNotBlank(video.getContentType())) {
			info.setFileName(this.getFileName(video));
			info.setContentType(video.getContentType());			
		} else {
			InternetAddress address = modelService.getChild(video, InternetAddress.class);
			if (address!=null) {
				String code = youTubeService.extractCodeFromUrl(address.getAddress());
				if (code!=null) {
					info.setHtml(youTubeService.getEmbedHTML(code));
				}
			}
		}
		video.getPropertyValue("contest");
		Image poster = modelService.getChild(video, Image.class);
		info.setPoster(poster);
		info.setOwner(modelService.getOwner(video));
		info.setType(Math.random()>.5 ? "video" : "audio");
		info.setInContest(Math.random()>.5);
		return info;
	}
	
	public boolean isSupportedVideoUrl(String url) {
		if (!URLUtil.isValidHttpUrl(url)) {
			return false;
		}
		return youTubeService.isSupportedUrl(url);
	}
	
	public Video createVideoFromUrl(String title,String url, Privileged priviledged) throws EndUserException {
		if (!URLUtil.isValidHttpUrl(url)) {
			throw new IllegalRequestException("The url is not valid","urlNotValid");
		}
		Video video = new Video();
		video.setName(title);
		modelService.createItem(video, priviledged);
		InternetAddress address = new InternetAddress();
		address.setAddress(url);
		modelService.createItem(address, priviledged);
		modelService.createRelation(video, address, priviledged);
		return video;
	}

	public void setStorageService(StorageService storageService) {
		this.storageService = storageService;
	}

	public StorageService getStorageService() {
		return storageService;
	}

	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}

	public ConfigurationService getConfigurationService() {
		return configurationService;
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public ModelService getModelService() {
		return modelService;
	}

	public void setFileService(FileService fileService) {
		this.fileService = fileService;
	}

	public FileService getFileService() {
		return fileService;
	}

	public void setYouTubeService(YouTubeService youTubeService) {
		this.youTubeService = youTubeService;
	}

	public YouTubeService getYouTubeService() {
		return youTubeService;
	}
}
