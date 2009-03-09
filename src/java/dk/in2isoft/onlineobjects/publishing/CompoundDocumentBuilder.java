package dk.in2isoft.onlineobjects.publishing;

import java.util.Map.Entry;

import nu.xom.Attribute;
import nu.xom.Element;
import nu.xom.Node;
import nu.xom.Nodes;
import nu.xom.XPathContext;

import org.apache.commons.lang.StringUtils;

import com.google.common.collect.ImmutableMap;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelFacade;
import dk.in2isoft.onlineobjects.core.Priviledged;
import dk.in2isoft.onlineobjects.model.CompoundDocument;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Property;

public class CompoundDocumentBuilder extends DocumentBuilder {

	private static ImmutableMap<String, String> styles = ImmutableMap.of(Property.KEY_STYLE_MARGIN_TOP, "top", Property.KEY_STYLE_MARGIN_BOTTOM, "bottom", Property.KEY_STYLE_MARGIN_LEFT, "left", Property.KEY_STYLE_MARGIN_RIGHT, "right");
	
	public CompoundDocumentBuilder() {
		super();
	}

	@Override
	public Node build(Document document) throws EndUserException {
		CompoundDocument compound = (CompoundDocument)document;
		Element root = new Element("CompoundDocument", CompoundDocument.CONTENT_NAMESPACE);
		nu.xom.Document structure = compound.getStructureDocument();
		insertParts(structure);
		Element struct = (Element)structure.getRootElement().copy();
		struct.setNamespaceURI(CompoundDocument.CONTENT_NAMESPACE);
		root.appendChild(struct);
		return root;
	}

	public void insertParts(nu.xom.Document document) throws EndUserException {
		XPathContext context = new XPathContext("doc",CompoundDocument.CONTENT_NAMESPACE);
		Nodes sections = document.query("//doc:section",context);
		for (int i = 0; i < sections.size(); i++) {
			Element section = (Element) sections.get(i);
			long id = Long.valueOf(section.getAttribute("part-id").getValue());
			Entity part = Core.getInstance().getModel().get(Entity.class, id);
			insertMargins(section, part);
			if (part!=null) {
				Node partNode = Core.getInstance().getConverter().generateXML(part);
				section.appendChild(partNode);
			}
		}
	}
	
	private void insertMargins(Element section, Entity part) {
		for (Entry<String, String> entry : styles.entrySet()) {
			String value = part.getPropertyValue(entry.getKey());
			if (StringUtils.isNotBlank(value)) {
				section.addAttribute(new Attribute(entry.getValue(),value));
			}
		}
	}
	

	@Override
	public Entity create(Priviledged priviledged) throws EndUserException {
		ModelFacade model = Core.getInstance().getModel();
		CompoundDocument document = new CompoundDocument();
		model.createItem(document, priviledged);
		return document;
	}
	
	

}
