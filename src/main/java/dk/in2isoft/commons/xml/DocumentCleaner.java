package dk.in2isoft.commons.xml;

import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Maps;
import com.google.common.collect.Multimap;
import com.google.common.collect.Sets;

public class DocumentCleaner {

	Multimap<String, String> validAttributes = HashMultimap.create();
	Set<String> validTags = Sets.newHashSet(); 

	public DocumentCleaner() {
		validAttributes.put("a", "href");
		validAttributes.put("a", "title");
		validAttributes.put("img", "src");
		validAttributes.put("img", "title");
		
		validTags.addAll(Sets.newHashSet("html","head","body","title"));
		validTags.addAll(Sets.newHashSet("h1","h2","h3","h4","h5","h6","p"));
		validTags.addAll(Sets.newHashSet("strong","em","a","img"));
		validTags.addAll(Sets.newHashSet("table","tbody","tr","th","td","thead","tfoot","colgroup","col","caption"));
		validTags.addAll(Sets.newHashSet("dl","dt","dd"));
		validTags.addAll(Sets.newHashSet("ul","ol","li"));
	}
	
	public void clean(Document document) {

		NodeList nodes = document.getElementsByTagName("*");
		int length = nodes.getLength();
		Set<Node> nodesToRemove = Sets.newHashSet();
		for (int i = 0; i < length; i++) {
			Node node = nodes.item(i);
			String nodeName = node.getNodeName().toLowerCase();
			if (!validTags.contains(nodeName)) {
				nodesToRemove.add(node);
			}
			
			NamedNodeMap attributes = node.getAttributes();
			Map<String,String> atts = Maps.newHashMap();
			for (int j = 0; j < attributes.getLength(); j++) {
				Node item = attributes.item(j);
				atts.put(item.getNodeName(),item.getNodeValue());
			}
			for (Entry<String, String> string : atts.entrySet()) {
				if (!validAttributes.containsEntry(nodeName, string)) {
					String ns = string.getValue();
					if (ns!=null) {
						attributes.removeNamedItemNS(ns,string.getKey());
					} else {
						attributes.removeNamedItem(string.getKey());
					}
				}
			}
		}
		
		for (Node node : nodesToRemove) {
			Node parent = node.getParentNode();
			if (parent!=null) {
				while (node.getFirstChild()!=null) {
					Node child = node.getFirstChild();
					node.removeChild(child);
					parent.insertBefore(child, node);
				}
				parent.removeChild(node);
			}
		}
	}
}
