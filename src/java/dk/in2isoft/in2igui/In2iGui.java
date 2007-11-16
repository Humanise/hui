package dk.in2isoft.in2igui;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintStream;
import java.io.StringReader;
import java.util.Hashtable;

import javax.servlet.http.HttpServletResponse;
import javax.xml.transform.Templates;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.TransformerFactoryConfigurationError;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.core.ConfigurationException;
import dk.in2isoft.onlineobjects.core.Core;

public class In2iGui {

	private String path = "";

	private static Hashtable<String, Templates> templates = new Hashtable<String, Templates>();

	private static TransformerFactory tFactory = TransformerFactory.newInstance();

	private static Logger log = Logger.getLogger(In2iGui.class);

	private static In2iGui instance;

	private In2iGui() {
		super();
		log.info("In2iGui initialized");
		try {
			path = Core.getInstance().getConfiguration().getBaseDir();
		} catch (ConfigurationException e) {
			log.error("Could not get configuration", e);
		}
	}

	public static In2iGui getInstance() {
		if (instance == null) {
			instance = new In2iGui();
		}
		return instance;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public void render(StreamSource source, OutputStream output) throws IOException {
		try {
			Transformer transformer = getTransformer();
			transformer.transform(source, new StreamResult(output));
		} catch (TransformerFactoryConfigurationError e) {
			e.printStackTrace(new PrintStream(output));
		} catch (TransformerConfigurationException e) {
			e.printStackTrace(new PrintStream(output));
		} catch (TransformerException e) {
			try {
				new OutputStreamWriter(output).write("<?xml version=\"1.0\"?><error><message>" + e.getMessage()
						+ "</message></error>");
			} catch (IOException ex) {
				log.error(ex.getMessage(), ex);
			}
		}
	}

	public void render(String xmlData, HttpServletResponse response) throws IOException {
		OutputStream stream = response.getOutputStream();
		try {
			response.setContentType("text/html");
			response.setCharacterEncoding("UTF-8");
			StringReader xmlReader = new StringReader("<?xml version=\"1.0\"?>" + xmlData);
			render(new StreamSource(xmlReader), stream);
		} catch (TransformerFactoryConfigurationError e) {
			e.printStackTrace(new PrintStream(stream));
		}
	}

	public void render(File file, HttpServletResponse response) throws IOException {
		OutputStream stream = response.getOutputStream();
		try {
			response.setContentType("text/html");
			response.setCharacterEncoding("UTF-8");
			render(new StreamSource(file), stream);
		} catch (TransformerFactoryConfigurationError e) {
			e.printStackTrace(new PrintStream(stream));
		}
	}

	private Transformer getTransformer() throws TransformerFactoryConfigurationError, TransformerConfigurationException {
		log.info("In2iGui-template-count: " + templates.size());
		String key = "c";
		Templates temp = (Templates) templates.get(key);
		if (temp == null) {
			StringBuffer xslString = new StringBuffer();
			xslString.append("<?xml version='1.0' encoding='UTF-8'?>").append(
					"<xsl:stylesheet xmlns:xsl='http://www.w3.org/1999/XSL/Transform' version='1.0'>").append(
					"<xsl:output method='xml' indent='no' encoding='UTF-8'/>").append("<xsl:include href='").append(
					path).append("/In2iGui/xslt/gui.xsl'/>").append(
					"<xsl:template match='/'><xsl:apply-templates/></xsl:template>").append("</xsl:stylesheet>");
			StringReader xslReader = new StringReader(xslString.toString());
			temp = tFactory.newTemplates(new StreamSource(xslReader));
			//templates.put(key, temp);
			log.info("New template!");
		}
		return temp.newTransformer();
	}
}
