package dk.in2isoft.commons.xml;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import nu.xom.Attribute;
import nu.xom.Builder;
import nu.xom.Element;
import nu.xom.Node;
import nu.xom.Nodes;
import nu.xom.ParentNode;
import nu.xom.ParsingException;
import nu.xom.ValidityException;
import nu.xom.XMLException;
import nu.xom.XPathContext;
import nu.xom.converters.DOMConverter;

import org.apache.tools.ant.filters.StringInputStream;
import org.eclipse.jdt.annotation.Nullable;
import org.jdom2.input.DOMBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

import dk.in2isoft.commons.lang.Strings;

public class DOM {
	
	private static final Logger log = LoggerFactory.getLogger(DOM.class);

	public static List<Element> getAncestors(Node node) {
		List<Element> ancestors = new ArrayList<Element>();
		while (node.getParent() != null) {
			ParentNode parent = node.getParent();
			if (parent instanceof Element) {
				ancestors.add((Element) parent);
			}
			node = node.getParent();
		}
		return ancestors;
	}

	public static nu.xom.Document toXOM(Document domDocument) {
		try {
			return DOMConverter.convert(domDocument);
		} catch (XMLException e) {
			log.warn("Unable to convert DOM to XOM", e);
			return null;
		}
	}
	
	public static org.jdom2.Document toJDOM(Document domDocument) {
		DOMBuilder jdomBuilder = new DOMBuilder();
        return jdomBuilder.build(domDocument);
	}

	public static nu.xom.Document parseXOM(String string) {

		try (StringReader reader = new StringReader(string)) {
			Builder bob = new Builder();
			return bob.build(reader);
		} catch (ValidityException e) {
			
		} catch (ParsingException e) {
			
		} catch (IOException e) {
			
		}
		return null;
	}

	public static @Nullable Document parseDOM(String string) {
		if (Strings.isNotBlank(string)) {
			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			try {
				StringInputStream input = new StringInputStream(string);
				DocumentBuilder db = dbf.newDocumentBuilder();
				return db.parse(input);
			} catch (ParserConfigurationException e) {
				log.warn(e.getMessage(), e);
			} catch (IOException e) {
				log.warn(e.getMessage(), e);
			} catch (SAXException e) {
				log.warn(e.getMessage(), e);
			}
		}
		return null;
	}

	public static Element findCommonAncestor(Node first, Node second) {
		List<Element> firstAncestors = DOM.getAncestors(first);
		List<Element> secondAncestors = DOM.getAncestors(second);
		for (Element node : secondAncestors) {
			if (firstAncestors.contains(node)) {
				return node;
			}
		}
		return null;
	}

	public static void appendToAttribute(Element element, String name,
			String value) {
		Attribute attribute = element.getAttribute(name);
		if (attribute == null) {
			element.addAttribute(new Attribute(name, value));
		} else {
			attribute.setValue(attribute.getValue() + " " + value);
		}
	}

	public static String getBodyXML(nu.xom.Document document) {
		StringBuilder sb = new StringBuilder();
		XPathContext c = new XPathContext();
		c.addNamespace("html", document.getRootElement().getNamespaceURI());
		Nodes bodies = document.query("//html:body", c);
		if (bodies.size() > 0) {
			Node node = bodies.get(0);
			if (node instanceof Element) {
				Element body = (Element) node;
				int childCount = body.getChildCount();
				for (int i = 0; i < childCount; i++) {
					Node child = body.getChild(i);

					sb.append(child.toXML());
				}
			}
		}
		return sb.toString();
	}
}
