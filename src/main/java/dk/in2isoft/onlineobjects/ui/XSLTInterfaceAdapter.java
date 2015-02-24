package dk.in2isoft.onlineobjects.ui;

import nu.xom.Document;
import nu.xom.Element;
import nu.xom.Node;
import nu.xom.converters.DOMConverter;

import org.apache.xerces.dom.DOMImplementationImpl;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Entity;


public abstract class XSLTInterfaceAdapter extends XSLTInterface {

	@Override
	public final org.w3c.dom.Document getData() throws ModelException {
		return DOMConverter.convert(build(),new DOMImplementationImpl());
	}
	
	@Override
	public final Document getDocument() throws ModelException {
		return build();
	}

	private Document build() throws ModelException {
		Element page = new Element("page",NAMESPACE_PAGE);
		Document doc = new Document(page);
		buildContent(page);
		return doc;
	}

	protected String convertToXML(Entity entity) throws ModelException {
		return Core.getInstance().getConversionService().generateXML(entity).toXML();
	}

	protected Node convertToNode(Entity entity) throws ModelException {
		return Core.getInstance().getConversionService().generateXML(entity);
	}
	
	protected abstract void buildContent(Element parent) throws ModelException;

	protected Element create(String name) {
		return new Element(name,NAMESPACE_PAGE);
	}

	protected Element createPageNode(Element parent, String name) {
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
