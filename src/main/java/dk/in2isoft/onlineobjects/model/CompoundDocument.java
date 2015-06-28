package dk.in2isoft.onlineobjects.model;

import java.io.IOException;
import java.io.StringReader;

import nu.xom.Builder;
import nu.xom.Element;
import nu.xom.ParsingException;
import nu.xom.ValidityException;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.publishing.CompoundDocumentBuilder;
import dk.in2isoft.onlineobjects.publishing.Document;
import dk.in2isoft.onlineobjects.publishing.DocumentBuilder;


public class CompoundDocument extends Entity implements Document {

	public static String TYPE = Entity.TYPE+"/CompoundDocument";
	public static String NAMESPACE = Entity.NAMESPACE+"CompoundDocument/";
	public static String CONTENT_NAMESPACE = "http://uri.onlineobjects.com/publishing/Document/CompoundDocument/";
	
	private String structure;
	
	public CompoundDocument() {
		super();
	}

	public String getType() {
		return TYPE;
	}

	public String getIcon() {
		return "Template/Generic";
	}

	public DocumentBuilder getBuilder() {
		return new CompoundDocumentBuilder();
	}

	public String getStructure() {
		return structure;
	}

	public void setStructure(String structure) {
		this.structure = structure;
	}
	
	public nu.xom.Document getStructureDocument() throws EndUserException {

		if (structure==null) {
			return new nu.xom.Document(new Element("structure",CONTENT_NAMESPACE));
		} else {
			Builder parser = new Builder();
			try {
				return parser.build(new StringReader(structure));
			} catch (ValidityException e) {
				throw new EndUserException(e);
			} catch (ParsingException e) {
				throw new EndUserException(e);
			} catch (IOException e) {
				throw new EndUserException(e);
			}
		}
	}
}
