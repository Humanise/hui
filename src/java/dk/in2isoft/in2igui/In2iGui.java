package dk.in2isoft.in2igui;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintStream;
import java.io.StringReader;
import java.util.Hashtable;

import javax.servlet.http.HttpServletRequest;
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

import dk.in2isoft.onlineobjects.core.Configuration;
import dk.in2isoft.onlineobjects.core.Core;

public class In2iGui {

	private String path = "";
	private boolean developmentMode;

	private static Hashtable<String, Templates> templates = new Hashtable<String, Templates>();

	private static TransformerFactory tFactory = TransformerFactory.newInstance();

	private static Logger log = Logger.getLogger(In2iGui.class);

	private static In2iGui instance;

	private In2iGui() {
		super();
		log.info("In2iGui initialized");
		Configuration config = Core.getInstance().getConfiguration();
		developmentMode = config.getDevelopmentMode();
		path = config.getAlternativeIn2iGuiPath();
		if (path==null) {
			path = config.getFile("In2iGui").getAbsolutePath();
		}
	}

	public static In2iGui getInstance() {
		if (instance == null) {
			instance = new In2iGui();
		}
		return instance;
	}
	
	public String getPath() {
		return path;
	}

	public void render(StreamSource source, OutputStream output, String context,boolean devMode) throws IOException {
		try {
			Transformer transformer = getTransformer();
			transformer.setParameter("context", context);
			transformer.setParameter("dev", devMode);
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
	
	private void setHeaders(HttpServletRequest request, HttpServletResponse response) {
		String accept = request.getHeader("Accept");
		if (accept!=null && accept.indexOf("application/xhtml+xml")!=-1) {
			response.setContentType("application/xhtml+xml");
		} else {
			response.setContentType("text/html");
		}
		response.setCharacterEncoding("UTF-8");
	}

	public void render(String xmlData, HttpServletRequest request,HttpServletResponse response) throws IOException {
		setHeaders(request, response);
		OutputStream stream = response.getOutputStream();
		try {
			boolean devMode = developmentMode;
			StringReader xmlReader = new StringReader("<?xml version=\"1.0\"?>" + xmlData);
			if ("true".equals(request.getParameter("nodev"))) {
				devMode=false;
			}
			render(new StreamSource(xmlReader), stream, request.getContextPath(),devMode);
		} catch (TransformerFactoryConfigurationError e) {
			e.printStackTrace(new PrintStream(stream));
		}
	}

	public void render(File file, HttpServletRequest request,HttpServletResponse response) throws IOException {
		setHeaders(request, response);
		OutputStream stream = response.getOutputStream();
		try {
			boolean devMode = developmentMode;
			if ("true".equals(request.getParameter("nodev"))) {
				devMode=false;
			}
			render(new StreamSource(file), stream, request.getContextPath(),devMode);
		} catch (TransformerFactoryConfigurationError e) {
			e.printStackTrace(new PrintStream(stream));
		}
	}

	private Transformer getTransformer() throws TransformerFactoryConfigurationError, TransformerConfigurationException {
		log.info("In2iGui-template-count: " + templates.size());
		String key = "c";
		Templates temp = (Templates) templates.get(key);
		if (temp == null) {
			StringBuilder xslString = new StringBuilder();
			xslString.append("<?xml version='1.0' encoding='UTF-8'?>").append(
					"<xsl:stylesheet xmlns:xsl='http://www.w3.org/1999/XSL/Transform' version='1.0'>").append(
					"<xsl:output method='xml' indent='no' encoding='UTF-8'/><xsl:param name='dev'/><xsl:param name='context'/>").append("<xsl:include href='").append(
					path).append("/xslt/gui.xsl'/>").append(
					"<xsl:template match='/'><xsl:apply-templates/></xsl:template>").append("</xsl:stylesheet>");
			StringReader xslReader = new StringReader(xslString.toString());
			temp = tFactory.newTemplates(new StreamSource(xslReader));
			//templates.put(key, temp);
			log.info("New template!");
		}
		return temp.newTransformer();
	}
}
