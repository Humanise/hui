package dk.in2isoft.onlineobjects.ui;

import nu.xom.Document;
import nu.xom.Element;
import nu.xom.Node;
import nu.xom.converters.DOMConverter;

import com.sun.org.apache.xerces.internal.dom.DOMImplementationImpl;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.model.Entity;


public abstract class XSLTInterfaceAdapter extends XSLTInterface {

	@Override
	public final org.w3c.dom.Document getData() {
		return DOMConverter.convert(build(),new DOMImplementationImpl());
	}

	private Document build() {
		Element page = new Element("page",NAMESPACE_PAGE);
		Document doc = new Document(page);
		buildContent(page);
		return doc;
	}

	protected String convertToXML(Entity entity) {
		return Core.getInstance().getConverter().generateXML(entity).toXML();
	}

	protected Node convertToNode(Entity entity) {
		return Core.getInstance().getConverter().generateXML(entity);
	}
	
	protected abstract void buildContent(Element parent);

	protected Element create(String name) {
		return new Element(name,NAMESPACE_PAGE);
	}

	protected Element create(Element parent, String name) {
		Element element = new Element(name,NAMESPACE_PAGE);
		parent.appendChild(element);
		return element;
	}

	protected Element create(String name, String text) {
		Element element = new Element(name,NAMESPACE_PAGE);
		element.appendChild(text);
		return element;
	}

}
