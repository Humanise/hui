package dk.in2isoft.onlineobjects.apps.videosharing.views;

import java.util.Date;

import dk.in2isoft.in2igui.data.VideoData;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.User;

public class VideoInfo implements VideoData {

	private Date created;
	private String fileName;
	private long id;
	private String title;
	private String contentType;
	private String html;
	private Image poster;
	private User owner;
	private String baseContext;
	private boolean inContest;
	private String type;

	public boolean isEmbedded() {
		return html!=null;
	}
	
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFileName() {
		return fileName;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getId() {
		return id;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getTitle() {
		return title;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	public String getContentType() {
		return contentType;
	}

	public void setHtml(String html) {
		this.html = html;
	}

	public String getHtml(int width, int height) {
		return html;
	}

	public void setPoster(Image poster) {
		this.poster = poster;
	}
	
	public Image getPoster() {
		return poster;
	}

	public String getPosterUrl(int width, int height) {
		if (poster==null) {
			return null;
		}
		return baseContext+"/service/image/id"+poster.getId()+"width"+width+"height"+height+"cropped.jpg";
	}

	public String getUrl(int width, int height) {
		return baseContext+"/service/video/id"+id+"/"+fileName;
	}

	public void setOwner(User owner) {
		this.owner = owner;
	}

	public User getOwner() {
		return owner;
	}

	public void setBaseContext(String baseContext) {
		this.baseContext = baseContext;
	}

	public void setCreated(Date created) {
		this.created = created;
	}

	public Date getCreated() {
		return created;
	}

	public void setInContest(boolean inContest) {
		this.inContest = inContest;
	}

	public boolean isInContest() {
		return inContest;
	}

	public void setType(String type) {
		this.type = type;
	}
	
	public String getType() {
		return type;
	}

}
