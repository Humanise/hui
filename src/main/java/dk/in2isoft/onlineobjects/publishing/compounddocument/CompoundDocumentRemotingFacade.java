package dk.in2isoft.onlineobjects.publishing.compounddocument;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.UnsupportedEncodingException;
import java.util.Map;

import nu.xom.Attribute;
import nu.xom.Document;
import nu.xom.Element;
import nu.xom.Elements;
import nu.xom.Node;
import nu.xom.Nodes;
import nu.xom.XPathContext;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.xml.XSLTUtil;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.CompoundDocument;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.HeaderPart;
import dk.in2isoft.onlineobjects.model.HtmlPart;
import dk.in2isoft.onlineobjects.model.ImagePart;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.publishing.CompoundDocumentBuilder;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.PageRenderingService;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;

public class CompoundDocumentRemotingFacade extends AbstractRemotingFacade {
	
	private PageRenderingService pageRenderingService;
	private ConfigurationService configurationService;
	private CompoundDocumentBuilder compoundDocumentBuilder;

	public String getStructure(long documentId) throws EndUserException {
		CompoundDocument doc = modelService.get(CompoundDocument.class, documentId, getUserSession());
		return doc.getStructure();
	}

	public void addRow(long documentId) throws EndUserException {
		CompoundDocument compound = modelService.get(CompoundDocument.class, documentId, getUserSession());
		Document doc = compound.getStructureDocument();
		Element row = new Element("row", CompoundDocument.CONTENT_NAMESPACE);
		row.appendChild(new Element("column", CompoundDocument.CONTENT_NAMESPACE));
		doc.getRootElement().appendChild(row);
		compound.setStructure(doc.toXML());
		modelService.updateItem(compound, getUserSession());
	}

	public void addColumn(long documentId,int rowIndex,int position) throws EndUserException {
		CompoundDocument compound = modelService.get(CompoundDocument.class, documentId, getUserSession());
		Document structure = compound.getStructureDocument();

		XPathContext context = new XPathContext("doc", CompoundDocument.CONTENT_NAMESPACE);
		Nodes rows = structure.query("//doc:row[position()=" + (rowIndex + 1) + "]", context);
		if (rows.size()==0) {
			throw new EndUserException("The row does not exist");
		}
		Element row = (Element) rows.get(0);
		Elements columns = row.getChildElements("column",CompoundDocument.CONTENT_NAMESPACE);
		if (columns.size()<position) {
			throw new EndUserException("Connot insert column in this position");
		}
		row.appendChild(new Element("column", CompoundDocument.CONTENT_NAMESPACE));
		compound.setStructure(structure.toXML());
		modelService.updateItem(compound, getUserSession());
	}

	public String getStructureHTML(long documentId) throws EndUserException, UnsupportedEncodingException {
		CompoundDocument doc = modelService.get(CompoundDocument.class, documentId, getUserSession());
		Document input = doc.getStructureDocument();
		compoundDocumentBuilder.insertParts(input, getUserSession());
		File stylsheet = configurationService.getFile(
				new String[] { "WEB-INF", "apps", "community", "web", "documents", "CompoundDocument", "xslt",
						"stylesheet.xsl" });
		ByteArrayOutputStream x = new ByteArrayOutputStream();
		Map<String, String> parameters = pageRenderingService.buildParameters(getRequest());
		XSLTUtil.applyXSLT(input.toXML(), stylsheet, x, parameters);
		return x.toString("UTF-8");
	}

	public void addPart(long documentId, int row, int columnIndex, int position, String type) throws EndUserException {
		CompoundDocument document = modelService.get(CompoundDocument.class, documentId, getUserSession());
		Document structure = document.getStructureDocument();
		XPathContext context = new XPathContext("doc", CompoundDocument.CONTENT_NAMESPACE);
		Nodes columns = structure.query("//doc:row[position()=" + (row + 1) + "]/doc:column[position()="
				+ (columnIndex + 1) + "]", context);
		if (columns.size() == 0) {
			throw new EndUserException("The column does not exists");
		} else {
			Element column = (Element) columns.get(0);
			if (column.getChildCount() < position) {
				throw new EndUserException("The position in the column is invalid");
			}
			
			Entity part = createPart(type);
			modelService.createItem(part, getUserSession());
			Relation relation = new Relation(document, part);
			relation.setKind("document.contains");
			modelService.createItem(relation, getUserSession());
			Element section = new Element("section", CompoundDocument.CONTENT_NAMESPACE);
			section.addAttribute(new Attribute("part-id", String.valueOf(part.getId())));
			column.insertChild(section, position);
			document.setStructure(structure.toXML());
			modelService.updateItem(document, getUserSession());
		}
	}

	public void updateColumn(long documentId, int row, int columnIndex, String width, String left, String right) throws EndUserException {
		CompoundDocument document = modelService.get(CompoundDocument.class, documentId, getUserSession());
		Document structure = document.getStructureDocument();
		XPathContext context = new XPathContext("doc", CompoundDocument.CONTENT_NAMESPACE);
		Nodes columns = structure.query("//doc:row[position()=" + (row + 1) + "]/doc:column[position()="
				+ (columnIndex + 1) + "]", context);
		if (columns.size() == 0) {
			throw new EndUserException("The column does not exists");
		} else {
			Element column = (Element) columns.get(0);
			setAttribute(column, "width", width);
			setAttribute(column, "left", left);
			setAttribute(column, "right", right);
			document.setStructure(structure.toXML());
			modelService.updateItem(document, getUserSession());
		}
	}
	
	private void setAttribute(Element element, String name, String value) {
		Attribute attribute = element.getAttribute(name);
		if (StringUtils.isBlank(value) && attribute!=null) {
			element.removeAttribute(attribute);
		} else if (attribute!=null) {
			attribute.setValue(value);
		} else {
			element.addAttribute(new Attribute(name,value));
		}
	}
	
	private Entity createPart(String type) throws EndUserException {
		if ("header".equals(type)) {
			HeaderPart part = new HeaderPart();
			part.setText("Overskrift");
			return part;
		} else if ("html".equals(type)) {
			HtmlPart part = new HtmlPart();
			part.setHtml("Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
			return part;
		} else if ("image".equals(type)) {
			ImagePart part = new ImagePart();
			return part;
		} else {
			throw new EndUserException("Unknown part type: "+type);
		}
	}

	public void removeColumn(long documentId, int rowIndex, int columnIndex) throws EndUserException {
		CompoundDocument document = modelService.get(CompoundDocument.class, documentId, getUserSession());
		Document structure = document.getStructureDocument();
		XPathContext context = new XPathContext("doc", CompoundDocument.CONTENT_NAMESPACE);
		Nodes columns = structure.query("//doc:row[position()=" + (rowIndex + 1) + "]/doc:column[position()="
				+ (columnIndex + 1) + "]", context);
		if (columns.size() == 0) {
			throw new EndUserException("The column does not exists");
		} else {
			Node columnOrRow = columns.get(0);
			if (columnOrRow.getParent().query("doc:column", context).size() == 1) {
				columnOrRow = columnOrRow.getParent();
			}
			Nodes sections = columnOrRow.query("descendant::doc:section", context);
			for (int i = 0; i < sections.size(); i++) {
				Element section = (Element) sections.get(i);
				long id = Long.valueOf(section.getAttribute("part-id").getValue());
				Entity part = modelService.get(Entity.class, id, getUserSession());
				if (part != null) {
					modelService.deleteEntity(part, getUserSession());
				}
			}
			columnOrRow.detach();
			document.setStructure(structure.toXML());
			modelService.updateItem(document, getUserSession());
		}
	}

	public void removePart(long documentId, long partId) throws EndUserException {
		CompoundDocument document = modelService.get(CompoundDocument.class, documentId, getUserSession());
		Document structure = document.getStructureDocument();
		XPathContext context = new XPathContext("doc", CompoundDocument.CONTENT_NAMESPACE);
		Nodes sections = structure.query("//doc:section[@part-id='" + partId + "']", context);
		if (sections.size() != 1) {
			throw new EndUserException(sections.size() + " sections was found");
		}
		sections.get(0).detach();
		document.setStructure(structure.toXML());
		modelService.updateItem(document, getUserSession());
		Entity part = modelService.get(Entity.class, partId, getUserSession());
		modelService.deleteEntity(part, getUserSession());
	}

	public void setPageRenderingService(PageRenderingService pageRenderingService) {
		this.pageRenderingService = pageRenderingService;
	}

	public PageRenderingService getPageRenderingService() {
		return pageRenderingService;
	}

	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}

	public ConfigurationService getConfigurationService() {
		return configurationService;
	}
	
	public void setCompoundDocumentBuilder(CompoundDocumentBuilder compoundDocumentBuilder) {
		this.compoundDocumentBuilder = compoundDocumentBuilder;
	}
}
