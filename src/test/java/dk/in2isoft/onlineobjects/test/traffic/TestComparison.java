package dk.in2isoft.onlineobjects.test.traffic;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.log4j.Logger;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.sun.syndication.feed.WireFeed;
import com.sun.syndication.feed.atom.Feed;
import com.sun.syndication.feed.atom.Link;
import com.sun.syndication.feed.rss.Channel;
import com.sun.syndication.feed.rss.Item;
import com.sun.syndication.io.WireFeedInput;
import com.sun.syndication.io.XmlReader;

import de.l3s.boilerpipe.BoilerpipeProcessingException;
import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.commons.lang.Matrix;
import dk.in2isoft.commons.lang.MatrixEntry;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.services.SemanticService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;
import dk.in2isoft.onlineobjects.util.semantics.Danish;
import dk.in2isoft.onlineobjects.util.semantics.English;
import dk.in2isoft.onlineobjects.util.semantics.Language;

public class TestComparison extends AbstractSpringTestCase {
	
	private static Logger log = Logger.getLogger(TestComparison.class);
	
	@Autowired
	private SemanticService semanticService;
	
	@Autowired
	private HTMLService htmlService;
	
	@Test
	public void testWikipedia() throws Exception {
		
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
		compareUrls(urls, new English());
	}
	
	private List<String> getUrlsInFeed(String url) {
		List<String> urls = Lists.newArrayList();
		URL feedUrl;
		try {
			feedUrl = new URL(url);
		} catch (MalformedURLException e) {
			log.error("Malformed url: "+url, e);
			return null;
		}

        WireFeedInput input = new WireFeedInput();
        WireFeed wireFeed;
		try {
			wireFeed = input.build(new XmlReader(feedUrl));
		} catch (Exception e) {
			log.error("Unable to parse url: "+url, e);
			return null;
		}
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
		return urls;
	}
	
	@Ignore
	@Test
	public void testFeed() throws Exception {
		
		List<String> feeds = Lists.newArrayList("http://politiken.dk/rss/senestenyt.rss","http://www.dr.dk/nyheder/service/feeds/allenyheder","http://www.b.dk/feeds/rss/Kronikker");
		
		List<String> urls = Lists.newArrayList();
		
		for (String feed : feeds) {
			List<String> urlsInFeed = getUrlsInFeed(feed);
			if (urlsInFeed!=null) {
				urls.addAll(urlsInFeed);
			}
		}		
		compareUrls(urls, new Danish());
	}

	private void compareUrls(List<String> urls, Language language) throws MalformedURLException, BoilerpipeProcessingException {
		Map<String,String> docs = Maps.newHashMap();
		for (String url : urls) {
			HTMLDocument document = htmlService.getDocumentSilently(url);
			if (document!=null) {
				String text = document.getExtractedText();
				docs.put(document.getTitle()+" : "+url, text);
			}
		}
		
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
		
		log.info("Frequency: "+freq);
		
		logMatrix(matrix);
		
	}

	private void logMatrix(Matrix<String, String, Double> matrix) {
		log.info("-------- Entries by value --------");
		List<MatrixEntry<String,String,Double>> entries = matrix.getEntries();
		Collections.sort(entries, new Comparator<MatrixEntry<String,String,Double>>() {

			public int compare(MatrixEntry<String, String, Double> o1, MatrixEntry<String, String, Double> o2) {
				return o1.getValue().compareTo(o2.getValue());
			}
		});
		Map<String,String> exists = new HashMap<String, String>();
		for (MatrixEntry<String, String, Double> entry : entries) {
			if (entry.getX().equals(entry.getY())) {
				continue;
			}
			if (exists.containsKey(entry.getX()) && exists.get(entry.getX()).equals(entry.getY())) {
				continue;
			}
			log.info("----------------");
			log.info("value: "+entry.getValue());
			log.info("X: "+entry.getX());
			log.info("Y: "+entry.getY());
			exists.put(entry.getX(), entry.getY());
			exists.put(entry.getY(), entry.getX());
		}
	}

	public void setSemanticService(SemanticService semanticService) {
		this.semanticService = semanticService;
	}

	public SemanticService getSemanticService() {
		return semanticService;
	}
}