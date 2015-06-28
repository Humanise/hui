package dk.in2isoft.onlineobjects.test.parsing;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import nu.xom.Attribute;
import nu.xom.Document;
import nu.xom.Element;
import nu.xom.Node;
import nu.xom.Nodes;
import nu.xom.Text;
import nu.xom.XPathContext;

import org.apache.log4j.Logger;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.common.collect.Lists;

import de.l3s.boilerpipe.BoilerpipeProcessingException;
import de.l3s.boilerpipe.extractors.ArticleExtractor;
import de.l3s.boilerpipe.extractors.DefaultExtractor;
import dk.in2isoft.commons.lang.Files;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.commons.xml.DOM;
import dk.in2isoft.commons.xml.Serializing;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.services.SemanticService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestHTMLParsing extends AbstractSpringTestCase {
	
	private static Logger log = Logger.getLogger(TestHTMLParsing.class);
	
	@Autowired
	private SemanticService semanticService;
		
	@Autowired
	private HTMLService htmlService;

	@Test
	public void testComplexWikipediaPage() throws Exception {
		runTest("kommunaldirektoer_fyret_efter_beskyldninger_mod_borgmester.html");
		runTest("language_wikipedia.html");
		runTest("masho_tilbage.html");
		runTest("penney_stays_course.seattletimes.com.html");
		runTest("storbritannien_lurepasser.politiken.dk.html");
	}
	
	private void runTest(String fileName) throws MalformedURLException, IOException, BoilerpipeProcessingException {
		URI uri = getTestFile("articles/"+fileName).toURI();
		HTMLDocument doc = htmlService.getDocumentSilently(uri);
		
		Document document = doc.getXOMDocument();
		
		log.info("Parsed: "+fileName);
		
		XPathContext context = new XPathContext("html", document.getRootElement().getNamespaceURI());
		
		log.info("Removing tags...");
		removeTags(document, "script", context);
		removeTags(document, "style", context);
		removeTags(document, "link", context);
		removeTags(document, "meta", context);
		
		removeAttributes(document, "style", context);
		Text largestText = findLargestText(document, context);
		log.info("Largest: "+largestText.toXML());
		
		Element title = findTitle(document, context);
		log.info("Title: "+title.toXML());
		
		//title = findNearest(largestText, findTitleCandidates(document, context));
		//log.info("Title (nearest): "+title.toXML());
		
		Element common = DOM.findCommonAncestor(largestText, title);
		log.info("Common: "+common.getLocalName()+"."+common.getAttributeValue("class"));
		
		//common = findFirstParentWithHeader(largestText, context);
		
		markLongTextNodes(document, context);
		
		common.getParent().removeChild(common);
		
		Element body = findFirstByName(document, "body", context);
		body.removeChildren();
		body.appendChild(common);
		
		/*
		Nodes ULs = document.getRootElement().query("//html:ul",context );
		for (int i = 0; i < ULs.size(); i++) {
			Node node = ULs.get(i);
			if (node instanceof Element) {
				Element ul = (Element) node;
				//ul.addAttribute(new Attribute("style", "opacity: .1;"));
			}
		}*/
		File dir = getOutputDir();
		File file = new File(dir,fileName);
		if (file.exists()) {
			file.delete();
		}
		
		
		
		
		
		
		
		
		
		
		Serializing.writeAsXHTML(document, file);
		
		log.info("Written: "+file.getCanonicalPath());
		
		{
			String text = ArticleExtractor.INSTANCE.getText(uri.toURL());
			Files.overwriteTextFile(text, new File(dir,fileName+".article.txt"));
		}

		{
			String text = DefaultExtractor.INSTANCE.getText(uri.toURL());
			Files.overwriteTextFile(text, new File(dir,fileName+".default.txt"));
		}
	}
	/*
	private Element findArticle() {
		return null;
	}*/
	/*
	private Element findFirstParentWithHeader(Node node, XPathContext context) {
		
		while (node.getParent()!=null && node.getParent() instanceof Element) {
			ParentNode parent = node.getParent();
			Nodes titles = parent.query(".//html:h1|.//html:h2", context);
			if (titles.size()>0) {
				return (Element) parent;
			}
			node = parent;
		}
		
		
		return null;
	}*/
	
	private Element findTitle(Document doc, XPathContext context) {
		return findFirstByName(doc, "h1", context);
	}
	
	private Element findFirstByName(Document doc, String name, XPathContext context) {
		Nodes nodes = doc.getRootElement().query("//html:"+name,context );
		if (nodes.size()>0) {
			return (Element) nodes.get(0);
		}
		return null;
	}
	/*
	private Element findNearest(Node node, List<Element> candidates) {
		return candidates.get(candidates.size()-1);
	}

	private List<Element> findTitleCandidates(Document doc, XPathContext context) {
		List<Element> titles = Lists.newArrayList();
		Nodes nodes = doc.getRootElement().query("//html:h1|//html:h2",context );
		for (int i = 0; i < nodes.size(); i++) {
			Node node = nodes.get(i);
			titles.add((Element) node);
		}
		return titles;
	}*/

	private Text findLargestText(Document doc, XPathContext context) {
		Text found = null;
		Nodes nodes = doc.getRootElement().query("//text()",context );
		for (int i = 0; i < nodes.size(); i++) {
			Node node = nodes.get(i);
			//node.getParent().removeChild(node);
			if (node instanceof Text) {
				Text text = (Text) node;
				if (found==null) {
					found = text;
				} else if (found.getValue().length() < text.getValue().length()) {
					found = text;
				}
			}
		}
		return found;
	}

	private void markLongTextNodes(Document doc, XPathContext context) {
		List<Text> lengths = Lists.newArrayList();
		Nodes nodes = doc.getRootElement().query("//text()",context );
		int max = 0;
		for (int i = 0; i < nodes.size(); i++) {
			Node node = nodes.get(i);
			if (node instanceof Text) {
				Text text = (Text) node;
				String value = text.getValue().trim();
				if (Strings.isBlank(value)) {
					continue;
				}
				max = Math.max(max, value.length());
				lengths.add(text);
				if (value.length()>100) {
					//((Element)text.getParent()).addAttribute(new Attribute("style", "background: #ff0;"));
				}
			}
		}
		Collections.sort(lengths, new Comparator<Text>() {

			public int compare(Text o1, Text o2) {
				int l1 = o1.getValue().length();
				int l2 = o2.getValue().length();
				return l1-l2;
			}
		});
		for (int i = 0; i < lengths.size(); i++) {
			Text text = lengths.get(i);
			String value = text.getValue().trim();
			
			float opacity = ((float)value.length() / (float) max);
			DOM.appendToAttribute((Element) text.getParent(), "style", "opacity: "+opacity+";");
			//((Element)text.getParent()).addAttribute(new Attribute("style", "opacity: "+opacity+";"));
		}
	}

	private void removeTags(Document doc, String name, XPathContext context) {
		Nodes nodes = doc.getRootElement().query("//html:"+name,context );
		for (int i = 0; i < nodes.size(); i++) {
			Node node = nodes.get(i);
			node.getParent().removeChild(node);
		}
	}
	
	private void removeAttributes(Document doc, String name, XPathContext context) {
		Nodes nodes = doc.getRootElement().query("//html:*[@"+name+"]",context );
		for (int i = 0; i < nodes.size(); i++) {
			Element node = (Element) nodes.get(i);
			Attribute attribute = node.getAttribute(name);
			if (attribute!=null) {
				node.removeAttribute(attribute);
			}
		}
	}

	public void setSemanticService(SemanticService semanticService) {
		this.semanticService = semanticService;
	}
	
	public void setHtmlService(HTMLService htmlService) {
		this.htmlService = htmlService;
	}
}