package dk.in2isoft.commons.xml;

import java.util.ArrayList;
import java.util.List;

import nu.xom.Attribute;
import nu.xom.Element;
import nu.xom.Node;
import nu.xom.ParentNode;

public class DOM {

	public static List<Element> getAncestors(Node node) {
		List<Element> ancestors = new ArrayList<Element>();
		while (node.getParent()!=null) {
			ParentNode parent = node.getParent();
			if (parent instanceof Element) {
				ancestors.add((Element) parent);
			}
			node = node.getParent();
		}
		return ancestors;
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
	
	public static void appendToAttribute(Element element, String name, String value) {
		Attribute attribute = element.getAttribute(name);
		if (attribute==null) {
			element.addAttribute(new Attribute(name, value));
		} else {
			attribute.setValue(attribute.getValue()+" "+value);
		}
	}
}
