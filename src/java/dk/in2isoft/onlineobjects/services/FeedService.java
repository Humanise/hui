package dk.in2isoft.onlineobjects.services;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

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

import dk.in2isoft.onlineobjects.core.exceptions.NetworkException;

public class FeedService {

	public List<Item> getFeedItems(String url) throws NetworkException {

        WireFeedInput input = new WireFeedInput();
        WireFeed feed;
		try {
			feed = input.build(new XmlReader(new URL(url)));
		} catch (IllegalArgumentException e) {
			throw new NetworkException(e);
		} catch (MalformedURLException e) {
			throw new NetworkException(e);
		} catch (FeedException e) {
			throw new NetworkException(e);
		} catch (IOException e) {
			throw new NetworkException(e);
		}
        if (feed instanceof Channel) {
        	Channel channel = (Channel) feed;
        	@SuppressWarnings("unchecked")
			List<Item> items = channel.getItems();
        	return items;
        } else if (feed instanceof Feed) {
        	List<Item> items = Lists.newArrayList();
        	Feed atom = (Feed) feed;
        	List<Entry> entries = atom.getEntries();
        	for (Entry entry : entries) {				
        		Item item = new Item();
        		item.setTitle(entry.getTitle());
        		List<Link> alternateLinks = entry.getAlternateLinks();
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
}
