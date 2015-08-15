package dk.in2isoft.commons.xml;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import nu.xom.Attribute;
import nu.xom.Element;
import nu.xom.Node;
import nu.xom.ParentNode;
import nu.xom.XMLException;
import nu.xom.converters.DOMConverter;

import org.apache.tools.ant.filters.StringInputStream;
import org.eclipse.jdt.annotation.Nullable;
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
			return null;
		}
	}

	public static @Nullable Document parse(String string) {
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
}
