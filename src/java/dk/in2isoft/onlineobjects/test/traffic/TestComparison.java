package dk.in2isoft.onlineobjects.test.traffic;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.log4j.Logger;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.sun.syndication.feed.WireFeed;
import com.sun.syndication.feed.atom.Feed;
import com.sun.syndication.feed.atom.Link;
import com.sun.syndication.feed.rss.Channel;
import com.sun.syndication.feed.rss.Item;
import com.sun.syndication.io.FeedException;
import com.sun.syndication.io.WireFeedInput;
import com.sun.syndication.io.XmlReader;

import dk.in2isoft.commons.lang.Matrix;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.services.SemanticService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;
import dk.in2isoft.onlineobjects.util.semantics.English;
import dk.in2isoft.onlineobjects.util.semantics.Language;

public class TestComparison extends AbstractSpringTestCase {
	
	private static Logger log = Logger.getLogger(TestComparison.class);
	
	@Autowired
	private SemanticService semanticService;
	
	@Test
	public void testWikipedia() throws EndUserException, MalformedURLException {
		
		List<String> urls = Lists.newArrayList(
				"http://en.wikipedia.org/wiki/Whale",
				"http://en.wikipedia.org/wiki/List_of_whale_species",
				"http://en.wikipedia.org/wiki/Humpback_Whale",
				"http://en.wikipedia.org/wiki/American_Revolutionary_War",
				"http://en.wikipedia.org/wiki/Rafael_Correa",
				"http://en.wikipedia.org/wiki/President_of_Ecuador",
				"http://en.wikipedia.org/wiki/Ecuador",
				"http://en.wikipedia.org/wiki/Inca_Empire",
				"http://en.wikipedia.org/wiki/South_America",
				"http://en.wikipedia.org/wiki/Argentina",
				"http://en.wikipedia.org/wiki/Mexico",
				"http://en.wikipedia.org/wiki/Apple_Inc.",
				"http://en.wikipedia.org/wiki/Steve_Jobs",
				"http://en.wikipedia.org/wiki/Buddhism"
		);
		compareUrls(urls);
	}
	
	//@Test
	public void testFeed() throws EndUserException, IllegalArgumentException, FeedException, IOException {
		
		List<String> urls = Lists.newArrayList();

		URL feedUrl = new URL("http://feeds.feedburner.com/AjaxRain"/*"http://www.alistapart.com/feed/rss.xml"*/);

        WireFeedInput input = new WireFeedInput();
        WireFeed wireFeed = input.build(new XmlReader(feedUrl));
        if (wireFeed instanceof Channel) {
        	Channel channel = (Channel) wireFeed;
        	List<Item> items = channel.getItems();
        	for (Item item : items) {
				urls.add(item.getLink());
			}
        }
        else if (wireFeed instanceof Feed) {
        	Feed feed = (Feed) wireFeed;
        	List<com.sun.syndication.feed.atom.Entry> entries = feed.getEntries();
        	for (com.sun.syndication.feed.atom.Entry entry : entries) {
        		List<Link> alternateLinks = entry.getAlternateLinks();
        		for (Link link : alternateLinks) {
        			urls.add(link.getHrefResolved());
				}
			}
        }
        System.out.println(wireFeed.getClass());
		compareUrls(urls);
	}

	private void compareUrls(List<String> urls) throws MalformedURLException {
		Map<String,String> docs = Maps.newHashMap();
		for (String url : urls) {
			HTMLDocument document = new HTMLDocument(url);
			docs.put(document.getTitle()+" : "+url, document.getText());
		}
		
		Language language = new English();
		Matrix<String, String, Double> matrix = new Matrix<String, String, Double>();
		for (Entry<String, String> doc1 : docs.entrySet()) {
			for (Entry<String, String> doc2 : docs.entrySet()) {
				double comparison = semanticService.compare(doc1.getValue(), doc2.getValue(),language);
				matrix.put(doc1.getKey(), doc2.getKey(), comparison);
			}
		}
		
		log.info("\n"+matrix.toString());

		StringBuilder entiretext = new StringBuilder();
		for (String string : docs.values()) {
			entiretext.append(" ").append(string);
		}
		
		final Map<String, Integer> freq = semanticService.getWordFrquency(entiretext.toString().toLowerCase(),language);
		Map<String, Integer> sorted = new java.util.TreeMap<String,Integer>(new Comparator<String>() {
			public int compare(String o1, String o2) {
				return freq.get(o1).compareTo(freq.get(o2));
			}
		});
		sorted.putAll(freq);
		log.info(sorted);
	}

	public void setSemanticService(SemanticService semanticService) {
		this.semanticService = semanticService;
	}

	public SemanticService getSemanticService() {
		return semanticService;
	}
}