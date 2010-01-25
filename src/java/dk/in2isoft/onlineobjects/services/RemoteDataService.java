package dk.in2isoft.onlineobjects.services;

import java.net.MalformedURLException;
import java.util.List;

import com.sun.syndication.feed.rss.Description;
import com.sun.syndication.feed.rss.Item;

import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.commons.parsing.HTMLReference;
import dk.in2isoft.onlineobjects.core.NetworkException;
import dk.in2isoft.onlineobjects.model.RemoteAccount;
import dk.in2isoft.onlineobjects.util.remote.RemoteAccountInfo;
import dk.in2isoft.onlineobjects.util.remote.RemoteArticle;
import dk.in2isoft.onlineobjects.util.remote.RemoteImageGallery;
import dk.in2isoft.onlineobjects.util.remote.RemoteStatusUpdate;

public class RemoteDataService {
	
	private FeedService feedService;

	public RemoteAccountInfo getInfo(RemoteAccount account) {
		RemoteAccountInfo info = new RemoteAccountInfo();
		info.setRemoteAccount(account);
		if ("google.com".equals(account.getDomain())) {
			String picassaUrl = "http://picasaweb.google.com/data/feed/base/user/"+account.getUsername()+"?alt=rss&kind=album&hl=en_US";
			List<Item> items;
			try {
				items = feedService.getFeedItems(picassaUrl);
				if (items!=null) {
					for (Item item : items) {
						RemoteImageGallery gallery = new RemoteImageGallery();
						gallery.setUrl(item.getUri());
						gallery.setTitle(item.getTitle());
						info.addImageGallery(gallery);
					}
				}
			} catch (NetworkException e) {
				info.addWarning("Unable to get Picassa albums");
			}
		} else if ("apple.com".equals(account.getDomain())) {
			String url = "http://gallery.me.com/"+account.getUsername()+"/?webdav-method=truthget&feedfmt=recentrss&maxrec=12";List<Item> items;
			try {
				items = feedService.getFeedItems(url);
				if (items!=null) {
					for (Item item : items) {
						RemoteImageGallery gallery = new RemoteImageGallery();
						gallery.setUrl(item.getUri());
						gallery.setTitle(item.getTitle());
						info.addImageGallery(gallery);
					}
				}
			} catch (NetworkException e) {
				info.addWarning("Unable to get Mobile Me albums");
			}
		} else if ("twitter.com".equals(account.getDomain())) {
			String url = "http://twitter.com/"+account.getUsername();
			try {
				HTMLDocument document = new HTMLDocument(url);
				List<HTMLReference> references = document.getFeeds();
				for (HTMLReference htmlReference : references) {
					
					String feedUrl = htmlReference.getUrl();
					if (feedUrl!=null && feedUrl.contains("/statuses/")) {
						try {
							List<Item> feedItems = feedService.getFeedItems(feedUrl);
							for (Item item : feedItems) {
								RemoteStatusUpdate update = new RemoteStatusUpdate();
								update.setDate(item.getPubDate());
								update.setText(item.getTitle());
								info.addStatusUpdate(update);
							}
						} catch (NetworkException e) {
							info.addWarning("Unable to get twitter status from feed");
						}
					}
				}
			} catch (MalformedURLException e) {
				info.addWarning("Unable to get twitter status");
			}
		} else if ("wordpress.com".equals(account.getDomain())) {
			String url = "http://"+account.getUsername()+".wordpress.com/feed/";
			try {
				List<Item> items = feedService.getFeedItems(url);
				for (Item item : items) {
					RemoteArticle article = new RemoteArticle();
					article.setUrl(item.getLink());
					article.setDate(item.getPubDate());
					article.setTitle(item.getTitle());
					Description description = item.getDescription();
					if (description!=null) {
						article.setMarkup(description.getValue());
					}
					info.addArticle(article);
				}
			} catch (NetworkException e) {
				info.addWarning("Unable to get WordPress feed");
			}
			
		}
		return info;
	}

	public void setFeedService(FeedService feedService) {
		this.feedService = feedService;
	}

	public FeedService getFeedService() {
		return feedService;
	}
}
