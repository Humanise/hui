package dk.in2isoft.onlineobjects.services;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.util.List;

import org.apache.commons.io.IOUtils;

import com.google.common.collect.Lists;
import com.sun.syndication.feed.WireFeed;
import com.sun.syndication.feed.atom.Entry;
import com.sun.syndication.feed.atom.Feed;
import com.sun.syndication.feed.atom.Link;
import com.sun.syndication.feed.rss.Channel;
import com.sun.syndication.feed.rss.Item;
import com.sun.syndication.io.FeedException;
import com.sun.syndication.io.WireFeedInput;
import com.sun.syndication.io.XmlReader;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.NetworkException;
import dk.in2isoft.onlineobjects.modules.networking.NetworkResponse;
import dk.in2isoft.onlineobjects.modules.networking.NetworkService;

public class FeedService {
	
	private NetworkService networkService;

	public List<Item> getFeedItems(String url) throws NetworkException {

        WireFeedInput input = new WireFeedInput();
        WireFeed feed;
        XmlReader reader = null;
		try {
			NetworkResponse response = networkService.get(url);
			if (!response.isSuccess()) {
				throw new NetworkException("Unable to fecth");
			}
			File file = response.getFile();
			reader = new XmlReader(file);
			feed = input.build(reader);
		} catch (IllegalArgumentException e) {
			throw new NetworkException("Unable to get feed items: "+url,e);
		} catch (MalformedURLException e) {
			throw new NetworkException("Unable to get feed items: "+url,e);
		} catch (FeedException e) {
			throw new NetworkException("Unable to get feed items: "+url,e);
		} catch (IOException e) {
			throw new NetworkException("Unable to get feed items: "+url,e);
		} catch (URISyntaxException e) {
			throw new NetworkException("Unable to get feed items: "+url,e);
		} finally {
			IOUtils.closeQuietly(reader);
		}
        if (feed instanceof Channel) {
        	Channel channel = (Channel) feed;
			List<Item> items = Code.castList(channel.getItems());
        	return items;
        } else if (feed instanceof Feed) {
        	List<Item> items = Lists.newArrayList();
        	Feed atom = (Feed) feed;
        	List<Entry> entries = Code.castList(atom.getEntries());
        	for (Entry entry : entries) {				
        		Item item = new Item();
        		item.setTitle(entry.getTitle());
        		List<Link> alternateLinks = Code.castList(entry.getAlternateLinks());
        		for (Link link : alternateLinks) {
        			item.setLink(link.getHref());					
        			break;
				}
        		items.add(item);
			}
        	return items;
        }
        return null;
	}
	
	public dk.in2isoft.onlineobjects.modules.feeds.Feed parse(File file) throws IllegalRequestException {
        WireFeedInput input = new WireFeedInput();
        WireFeed wireFeed;
        XmlReader reader = null;
		try {
			reader = new XmlReader(file);
			wireFeed = input.build(reader);
			dk.in2isoft.onlineobjects.modules.feeds.Feed feed = new dk.in2isoft.onlineobjects.modules.feeds.Feed();
			if (wireFeed instanceof Channel) {
	        	Channel channel = (Channel) wireFeed;
	        	feed.setTitle(channel.getTitle());
			} else if (wireFeed instanceof Feed) {
				Feed atom = (Feed) wireFeed;
				feed.setTitle(atom.getTitle());
			}
			return feed;
		} catch (IOException e) {
			throw new IllegalRequestException("Could not parse the feed");
		} catch (IllegalArgumentException e) {
			throw new IllegalRequestException("Could not parse the feed");
		} catch (FeedException e) {
			throw new IllegalRequestException("Could not parse the feed");
		} finally {
			IOUtils.closeQuietly(reader);
		}
	}
	
	public void setNetworkService(NetworkService networkService) {
		this.networkService = networkService;
	}
}
