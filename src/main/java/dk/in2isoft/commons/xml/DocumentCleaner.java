package dk.in2isoft.commons.xml;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import nu.xom.Attribute;
import nu.xom.Element;
import nu.xom.Nodes;
import nu.xom.ParentNode;
import nu.xom.XPathContext;

import org.neo4j.helpers.Strings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Maps;
import com.google.common.collect.Multimap;
import com.google.common.collect.Sets;

public class DocumentCleaner {

	private Multimap<String, String> validAttributes = HashMultimap.create();
	private Set<String> validTags = Sets.newHashSet();
	private URI uri;
	
	private static final Logger log = LoggerFactory.getLogger(DocumentCleaner.class);

	public DocumentCleaner() {
		validAttributes.put("a", "href");
		validAttributes.put("a", "title");
		validAttributes.put("abbr", "title");
		validAttributes.put("time", "datetime");
		validAttributes.put("img", "src");
		validAttributes.put("img", "title");
		validAttributes.put("img", "width");
		validAttributes.put("img", "height");
		
		validTags.addAll(Sets.newHashSet("html","head","body","title"));
		validTags.addAll(Sets.newHashSet("h1","h2","h3","h4","h5","h6","p"));
		validTags.addAll(Sets.newHashSet("strong","em","a","img","br","hr"));
		validTags.addAll(Sets.newHashSet("sub","sup","abbr","dfn"));
		validTags.addAll(Sets.newHashSet("del","ins","cite","q"));
		validTags.addAll(Sets.newHashSet("code","tt","kbd","samp","var","time"));
		validTags.addAll(Sets.newHashSet("table","tbody","tr","th","td","thead","tfoot","colgroup","col","caption"));
		validTags.addAll(Sets.newHashSet("dl","dt","dd"));
		validTags.addAll(Sets.newHashSet("ul","ol","li"));
		validTags.addAll(Sets.newHashSet("blockquote","figure","figcaption","pre"));
	}
	
	public void setUrl(String url) {
		if (Strings.isBlank(url)) {
			uri = null;
		} else {
			try {
				this.uri = new URI(url);
			} catch (URISyntaxException e) {
				log.warn("Illegal URI",e);
			}
		}
	}
	
	public void clean(nu.xom.Document document) {
		if (document.getRootElement()==null) {
			return;
		}
		XPathContext context = new XPathContext("html", document.getRootElement().getNamespaceURI());
		Nodes nodes = document.query("//html:*",context);
		int length = nodes.size();
		Set<Element> nodesToRemove = Sets.newHashSet();
		for (int i = 0; i < length; i++) {
			nu.xom.Node node = nodes.get(i);
			if (node instanceof Element) {
				Element element = (Element) node;
				String nodeName = element.getLocalName().toLowerCase();
				if (!validTags.contains(nodeName)) {
					nodesToRemove.add(element);
				}
				
				element.getAttributeCount();
				for (int j = element.getAttributeCount() - 1; j >= 0; j--) {
					Attribute attribute = element.getAttribute(j);
					if (!validAttributes.containsEntry(nodeName, attribute.getLocalName())) {
						element.removeAttribute(attribute);
					}
				}
				
				for (Element toRemove : nodesToRemove) {
					ParentNode parent = toRemove.getParent();
					if (parent!=null) {
						int index = parent.indexOf(toRemove);
						while (toRemove.getChildCount()>0) {
							nu.xom.Node child = toRemove.removeChild(0);
							parent.insertChild(child, index);
							index ++;
						}
						parent.removeChild(toRemove);
					}
				}
			}
		}
		if (uri!=null) {
			Nodes images = document.query("//html:img",context);
			for (int i = 0; i < images.size(); i++) {
				Element image = (Element) images.get(i);
				Attribute attribute = image.getAttribute("src");
				if (attribute!=null) {
					String value = attribute.getValue();
					try {
						attribute.setValue(uri.resolve(value).toString());
					} catch (IllegalArgumentException e) {
						log.warn("Error resolving image URL",e);
					}
				}
			}
		}
		
	}
	
	@Deprecated
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
				String localName = item.getLocalName();
				if (localName==null) {
					localName = item.getNodeName();
				}
				if (!validAttributes.containsEntry(nodeName, localName)) {
					atts.put(localName,item.getNamespaceURI());
				}
			}
			for (Entry<String, String> entry : atts.entrySet()) {
				String ns = entry.getValue();
				String name = entry.getKey();
				if (ns!=null) {
					attributes.removeNamedItemNS(ns,name);
				} else {
					attributes.removeNamedItem(name);
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
