package dk.in2isoft.onlineobjects.modules.information;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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

import dk.in2isoft.onlineobjects.core.Pair;

public class ContentExtractor {
	
	private static final Logger log = LoggerFactory.getLogger(ContentExtractor.class);

	public Document extract(Document document) {
		List<Element> longestText = findLongestText(document);
		Element nearestAncestor = findNearestAncestor(longestText);
				
		Pair<Document,Element> pair = createEmptyDocument(document);
		Element body = pair.getValue();
		body.appendChild(nearestAncestor.copy());
		
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
	
	public List<Element> findLongestText(Document document) {
		Node root = document;
		Nodes articles = document.query("//*[local-name()='article']");
		if (articles.size()>0) {
			root = articles.get(0);
		}
		Multimap<Integer, Element> map = HashMultimap.create();
		Nodes ps = root.query("//*[local-name()='p']");
		for (int i = 0; i < ps.size(); i++) {
			Element p = (Element) ps.get(i);
			int length = getTextLength(p);
			map.put(length, p);
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
			length += value==null ? 0 : value.trim().length(); 
		} else {
			if (node instanceof Element) {
				String name = ((Element) node).getLocalName().toLowerCase();
				if (name.equals("script") || name.equals("style")) {
					return 0;
				}
			}
			int count = node.getChildCount();
			for (int i = 0; i < count; i++) {
				length+=getTextLength(node.getChild(i));
			}
		}
		return length;
	}
}
