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

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.commons.lang.Matrix;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.services.SemanticService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;
import dk.in2isoft.onlineobjects.util.semantics.English;
import dk.in2isoft.onlineobjects.util.semantics.Language;

public class TestFeedComparison extends AbstractSpringTestCase {
	
	private static Logger log = Logger.getLogger(TestFeedComparison.class);
	
	@Autowired
	private SemanticService semanticService;
	
	@Autowired
	private HTMLService htmlService;

	@Test
	public void testFeed() throws EndUserException, IllegalArgumentException, FeedException, IOException {
		
		List<String> urls = Lists.newArrayList();

		//URL feedUrl = new URL("http://feeds.feedburner.com/AjaxRain");
		URL feedUrl = new URL("http://feeds.feedburner.com/alistapart/main?format=xml");
		//URL feedUrl = new URL("http://www.readwriteweb.com/rss.xml");
		//URL feedUrl = new URL("http://3quarksdaily.blogs.com/3quarksdaily/index.rdf");
		
        WireFeedInput input = new WireFeedInput();
        WireFeed wireFeed = input.build(new XmlReader(feedUrl));
        if (wireFeed instanceof Channel) {
        	Channel channel = (Channel) wireFeed;
        	List<Item> items = Code.castList(channel.getItems());
        	for (Item item : items) {
				urls.add(item.getLink());
			}
        }
        else if (wireFeed instanceof Feed) {
        	Feed feed = (Feed) wireFeed;
        	List<com.sun.syndication.feed.atom.Entry> entries = Code.castList(feed.getEntries());
        	for (com.sun.syndication.feed.atom.Entry entry : entries) {
        		List<Link> alternateLinks = Code.castList(entry.getAlternateLinks());
        		for (Link link : alternateLinks) {
        			urls.add(link.getHrefResolved());
				}
			}
        }
        System.out.println(wireFeed.getClass());
        if (urls.size()>10) {
        	urls = urls.subList(0, 9);
        }
		urls.add("http://www.apple.com/hotnews/thoughts-on-flash/");
		compareUrls(urls);
	}

	private void compareUrls(List<String> urls) throws MalformedURLException {
		Map<String,String> docs = Maps.newHashMap();
		for (String url : urls) {
			log.info("Fetching: "+url);
			HTMLDocument document = htmlService.getDocumentSilently(url);
			if (document!=null) {
				docs.put(document.getTitle().trim()+" : "+url, document.getText());
			}
		}
		
		docs.put("CSS", "CSS");
		
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
		
		final Map<String, Integer> freq = semanticService.getWordFrequency(entiretext.toString().toLowerCase(),language);
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
	
	public void setHtmlService(HTMLService htmlService) {
		this.htmlService = htmlService;
	}
}