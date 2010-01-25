package dk.in2isoft.onlineobjects.modules.video;

import java.io.File;
import java.util.List;

import org.apache.log4j.Logger;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.util.AbstractCommandLineInterface;
import dk.in2isoft.onlineobjects.apps.videosharing.views.VideoInfo;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.model.Video;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.FileService;
import dk.in2isoft.onlineobjects.services.StorageService;

public class VideoService extends AbstractCommandLineInterface {

	private static Logger log = Logger.getLogger(VideoService.class);
	
	private StorageService storageService;
	private ConfigurationService configurationService;
	private FileService fileService;
	private ModelService modelService;

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

	public List<VideoInfo> buildVideoInfoList(Query<Video> query) {
		List<VideoInfo> out = Lists.newArrayList();
		List<Video> list = modelService.list(query);
		for (Video video : list) {
			out.add(getInfo(video));
		}
		return out;

	}

	public VideoInfo getInfo(Video video) {
		VideoInfo info = new VideoInfo();
		info.setId(video.getId());
		info.setTitle(video.getName());
		info.setFileName(this.getFileName(video));
		info.setContentType(video.getContentType());
		return info;
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
}
