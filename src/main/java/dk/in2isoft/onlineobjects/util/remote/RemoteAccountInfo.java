package dk.in2isoft.onlineobjects.util.remote;

import java.util.List;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.model.RemoteAccount;

public class RemoteAccountInfo {
	
	private List<RemoteImageGallery> imageGalleries = Lists.newArrayList();
	private List<RemoteStatusUpdate> statusUpdates = Lists.newArrayList();
	private List<RemoteArticle> articles = Lists.newArrayList();
	private List<String> warnings = Lists.newArrayList();
	private RemoteAccount remoteAccount;
	
	public void addImageGallery(RemoteImageGallery gallery) {
		imageGalleries.add(gallery);
	}

	public List<RemoteImageGallery> getImageGalleries() {
		return imageGalleries;
	}
	
	public void addStatusUpdate(RemoteStatusUpdate update) {
		statusUpdates.add(update);
	}

	public List<RemoteStatusUpdate> getStatusUpdates() {
		return statusUpdates;
	}
	
	public void addArticle(RemoteArticle article) {
		articles.add(article);
	}

	public List<RemoteArticle> getArticles() {
		return articles;
	}
	
	public List<String> getWarnings() {
		return warnings;
	}
	
	public void addWarning(String warning) {
		warnings.add(warning);
	}

	public void setRemoteAccount(RemoteAccount remoteAccount) {
		this.remoteAccount = remoteAccount;
	}

	public RemoteAccount getRemoteAccount() {
		return remoteAccount;
	}
}
