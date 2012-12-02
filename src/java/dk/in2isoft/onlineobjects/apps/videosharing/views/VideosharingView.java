package dk.in2isoft.onlineobjects.apps.videosharing.views;

import java.util.List;

import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.apps.videosharing.util.MockUtil;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.UserQuery;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Video;
import dk.in2isoft.onlineobjects.modules.user.UserInfo;
import dk.in2isoft.onlineobjects.modules.user.UserService;
import dk.in2isoft.onlineobjects.modules.video.VideoService;

public class VideosharingView extends AbstractManagedBean {
	
	private VideoService videoService;
	private UserService userService;
	
	private List<VideoInfo> allVideos;
	private List<UserInfo> users;
	
	public List<UserInfo> getUsers() throws ModelException {
		if (users==null) {
			UserQuery query = new UserQuery().withUsersChildren(Video.class);
			users = userService.list(query);
		}
		return users;
	}
	
	public List<VideoInfo> getAllVideos() throws ModelException {
		if (allVideos==null) {
			Query<Video> q = Query.of(Video.class).withPaging(0, 30).orderByCreated().descending();
			this.allVideos = videoService.buildVideoInfoList(q,getRequest());
		}
		return allVideos;
	}
	
	public List<ChartItemInfo> getTopVideoChart() {
		return MockUtil.buildMockChart();
	}
	
	public List<ChartItemInfo> getTopAudioChart() {
		return MockUtil.buildMockChart();
	}

	public void setVideoService(VideoService videoService) {
		this.videoService = videoService;
	}
	
	public void setUserService(UserService userService) {
		this.userService = userService;
	}

}
