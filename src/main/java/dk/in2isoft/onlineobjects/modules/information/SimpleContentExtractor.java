package dk.in2isoft.onlineobjects.modules.information;

import info.debatty.java.stringsimilarity.NormalizedLevenshtein;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import nu.xom.Comment;
import nu.xom.Document;
import nu.xom.Element;
import nu.xom.Node;
import nu.xom.Nodes;
import nu.xom.ParentNode;
import nu.xom.Text;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.LinkedHashMultimap;
import com.google.common.collect.Lists;
import com.google.common.collect.Multimap;
import com.google.common.collect.Multiset;
import com.google.common.collect.Sets;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.xml.HTML;
import dk.in2isoft.onlineobjects.core.Pair;

public class SimpleContentExtractor implements ContentExtractor {
	
	private static final Logger log = LoggerFactory.getLogger(SimpleContentExtractor.class);
	
	private Set<String> illegals = Sets.newHashSet("script","style","noscript");

	public Document extract(Document document) {
		//log.info(document.toXML());
		document = simplify(document);
		List<Element> longestText = findLongestText(document);
		Element heading = findHeading(document);
		if (heading!=null) {
			longestText.add(heading);
		}
/*		for (Element element : longestText) {
			log.info(element.toXML());
		}*/
		Element nearestAncestor = findNearestAncestor(longestText);
				
		Pair<Document,Element> pair = createEmptyDocument(document);
		Element body = pair.getValue();
		if (nearestAncestor!=null) {
			body.appendChild(nearestAncestor.copy());
		} else {
			log.warn("No ancestor found: longestText.size: " + longestText.size());
		}
		
		return pair.getKey();
	}
	
	private Pair<Document, Element> createEmptyDocument(Document original) {
		String ns = original.getRootElement().getNamespaceURI();
		Element html = new Element("html",ns);
		Element body = new Element("body",ns);
		html.appendChild(body);
		Document copy = new Document(html);
		
		return Pair.of(copy, body);
	}
	
	private Element findHeading(Document document) {
		Nodes headers = document.query("//*[local-name()='h1']");
		if (headers.size()==1) {
			return (Element) headers.get(0);
		}
		
		Element found = null;
		double foundSimilarity = -1;
		String title = null;

		Nodes titles = document.query("//*[local-name()='title']");
		if (titles.size() > 0) {
			title = getText(titles.get(0));
		}
		
		NormalizedLevenshtein l = new NormalizedLevenshtein();
		for (int i = 0; i < headers.size(); i++) {
			Element element = (Element) headers.get(i);
			if (title==null) {
				found = element;
				break;
			}
			String text = getText(element);
			double similarity = l.similarity(title, text);
			if (similarity > foundSimilarity) {
				foundSimilarity = similarity;
				found = element;
			}
		}
		
		return found;
	}
	
	private Document simplify(Document document) {
		document = (Document) document.copy();
				
		Set<Node> nodesToRemove = Sets.newHashSet();
		
		Nodes nodes = document.query("//node()");
		
		int size = nodes.size();
		for (int i = 0; i < size; i++) {
			Node node = nodes.get(i);
			if (node instanceof Comment) {
				nodesToRemove.add(node);
			}
			if (node instanceof Element) {
				Element element = (Element) node;
				if (!isValid(element)) {
					nodesToRemove.add(element);
				}
			}
		}
		
		for (Node node : nodesToRemove) {
			ParentNode parent = node.getParent();
			if (parent!=null && parent instanceof Element) {
				parent.removeChild(node);
			}
		}
		
		return document;
	}
	
	private boolean isValid(Element element) {
		String name = element.getLocalName().toLowerCase();
		if (illegals.contains(name)) {
			return false;
		}
		Set<String> roles = Sets.newHashSet("toolbar","search","contentinfo");
		String role = element.getAttributeValue("role");
		if (role!=null && roles.contains(role)) {
			return false;
		}
		String cls = element.getAttributeValue("class");
		if (cls!=null) {
			cls = cls.toLowerCase();
			if (cls.contains("share")) {
				return false;
			}
			if (cls.contains("comment")) {
				return element.query("//*[local-name()='h1']").size() == 0;
			}
		}
		
		return true;
	}

	public List<Element> findLongestText(Document document) {
		Node root = document;
		Nodes articles = document.query("//*[local-name()='article']");
		if (articles.size()>0) {
			root = articles.get(0);
		}
		Multimap<Integer, Element> map = HashMultimap.create();
		Nodes ps = root.query(".//*");
		for (int i = 0; i < ps.size(); i++) {
			Element p = (Element) ps.get(i);
			if (!HTML.INLINE_TEXT.contains(p.getLocalName().toLowerCase())) {
				int length = getTextLength(p);
				map.put(length, p);
			}
		}
		
		List<Element> lst = Lists.newArrayList(); 
		
		map.entries().stream().sorted((o1,o2) -> {
			return o2.getKey().compareTo(o1.getKey());
		}).limit(2).collect(Collectors.toList()).forEach(entry -> {
			lst.add(entry.getValue());
		});
		
		return lst;
	}
	
	private Element findNearestAncestor(List<? extends Node> nodes) {
		if (nodes.isEmpty()) {
			return null;
		}
		Element common = null;
		Multimap<Node,Element> paths = LinkedHashMultimap.create();
		for (Node node : nodes) {
			ParentNode parent = node.getParent();
			while (parent!=null && parent instanceof Element) {
				paths.put(node, (Element) parent);
				parent = parent.getParent();
			}
		}
		Multiset<Node> keys = paths.keys();
		List<Element> collection = Lists.newArrayList(paths.get(keys.iterator().next()));
		Collections.reverse(collection);
		
		for (Element prospect : collection) {
			for (Node key : keys) {
				if (!paths.containsEntry(key, prospect)) {
					return common;
				}
			}
			common = prospect;
		}
		
		return common;
	}
		
	private int getTextLength(Node node) {
		int length = 0;
		if (node instanceof Text) {
			String value = node.getValue();
			length += Strings.getVisibleLength(value); 
		} else if (node instanceof Element) {
			int count = node.getChildCount();
			for (int i = 0; i < count; i++) {
				Node child = node.getChild(i);
				if (child instanceof Element) {
					String name = ((Element) child).getLocalName().toLowerCase();
					if (HTML.INLINE_TEXT.contains(name)) {
						length+=getTextLength(child);
					}
				} else if (child instanceof Text) {
					length+=getTextLength(child);
				}
				
			}
		}
		return length;
	}
	
	private String getText(Node node) {
		String text = "";
		if (node instanceof Text) {
			String value = node.getValue();
			text += value==null ? "" : value;
		} else {
			int count = node.getChildCount();
			for (int i = 0; i < count; i++) {
				text+=getText(node.getChild(i));
			}
		}
		return text;
	}
}
