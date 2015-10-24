package dk.in2isoft.onlineobjects.apps.videosharing.views;

import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.UserQuery;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Comment;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Rating;
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
	private boolean canEdit;
	private VideoInfo videoInfo;
	private Rating rating;
	private double averageRating;
	private List<VideoInfo> usersVideos;
	private List<VideoInfo> relatedVideos;

	public void afterPropertiesSet() throws Exception {
		String[] localPath = getRequest().getLocalPath();
		UserQuery query = new UserQuery().withUsername(localPath[1]);
		List<Pair<User,Person>> result = modelService.searchPairs(query).getList();
		if (result.size()>0) {
			person = result.get(0).getValue();
			user = result.get(0).getKey();
		} else {
			throw new ContentNotFoundException("The person does not excist");
		}
		long id = Long.parseLong(localPath[2]);
		video = modelService.get(Video.class, id, getRequest().getSession());
		if (video==null) {
			throw new ContentNotFoundException("The video does not excist");
		}
		Query<Comment> commentQuery = Query.of(Comment.class).from(video).orderByCreated().descending();
		comments = modelService.list(commentQuery);
		canEdit = user.getId()==getRequest().getSession().getUser().getId();
		
		videoInfo = videoService.getInfo(video,getRequest());
		
		if (!isPublicUser()) {
			Query<Rating> q = Query.of(Rating.class).from(video).withPrivileged(getRequest().getSession());
			rating = modelService.search(q).getFirst();
		}

		Query<Rating> q = Query.of(Rating.class).from(video);
		SearchResult<Rating> search = modelService.search(q);
		averageRating = 0;
		List<Rating> ratings = search.getList();
		if (!ratings.isEmpty()) {
			for (Rating rating : ratings) {
				averageRating+=rating.getRating();
			}
			averageRating = averageRating/(double)ratings.size();
		}

		Query<Video> usersVideosQuery = Query.of(Video.class).withPrivileged(user).withPaging(0, 4).orderByCreated().descending();
		this.usersVideos = videoService.buildVideoInfoList(usersVideosQuery,getRequest());

		Query<Video> relatedVideosQuery = Query.of(Video.class);
		List<VideoInfo> relatedList = videoService.buildVideoInfoList(relatedVideosQuery,getRequest());
		this.relatedVideos = Lists.newArrayList();
		for (int i = 0; i < 4; i++) {
			if (relatedList.size()>0) {
				int index = (int) Math.round(Math.random()*(double)(relatedList.size()-1));
				relatedVideos.add(relatedList.remove(index));
			}
		}
	}
	
	public User getUser() {
		return user;
	}
	
	public Person getPerson() {
		return person;
	}
	
	public VideoInfo getVideoInfo() throws ModelException {
		return videoInfo;
	}
	
	public List<Comment> getComments() {
		return comments;
	}
	
	public boolean isCanEdit() {
		return canEdit;
	}
	
	public Rating getRating() {
		return rating;
	}
	
	public String getAverageRating() {
		return format(averageRating);
	}
	
	public String getUsersRating() {
		if (rating!=null) {
			return format(rating.getRating());
		} else {
			return format(0);
		}
	}
	
	private String format(double num) {
		NumberFormat nf = NumberFormat.getNumberInstance(Locale.ENGLISH);
		DecimalFormat df = (DecimalFormat)nf;
		df.applyPattern("0.00");
		if (num==0) {
			return "0.00";
		}
		else if (num>0) {
			return df.format(num*5);
		} else {
			return df.format(num*5);
		}
		
	}
	
	public String[] getRatingBars() {
		String[] bars = new String[10];
		if (rating!=null) {
			double value = rating.getRating();
			bars[0] = value<-.8 ? "minus_selected" : "minus";
			bars[1] = value<-.6 ? "minus_selected" : "minus";
			bars[2] = value<-.4 ? "minus_selected" : "minus";
			bars[3] = value<-.2 ? "minus_selected" : "minus";
			bars[4] = value<  0 ? "minus_selected" : "minus";
			bars[5] = value>  0 ? "plus_selected" : "plus";
			bars[6] = value> .2 ? "plus_selected" : "plus";
			bars[7] = value> .4 ? "plus_selected" : "plus";
			bars[8] = value> .6 ? "plus_selected" : "plus";
			bars[9] = value> .8 ? "plus_selected" : "plus";
		}
		return bars;
	}
	
	public List<VideoInfo> getUsersVideos() {
		return usersVideos;
	}
	
	public List<VideoInfo> getRelatedVideos() {
		return relatedVideos;
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
