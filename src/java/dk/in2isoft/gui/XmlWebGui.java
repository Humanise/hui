package dk.in2isoft.gui;

import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintStream;
import java.io.StringReader;
import java.util.Arrays;
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

import dk.in2isoft.onlineobjects.core.Core;

public class XmlWebGui {

	private String path = "";

	private String skin = null;

	private String iconSet = "";

	private static Hashtable<String, Templates> templates = new Hashtable<String, Templates>();

	private static TransformerFactory tFactory = TransformerFactory.newInstance();

	private static Logger log = Logger.getLogger(XmlWebGui.class);

	public XmlWebGui() {
		super();
		skin = "In2ition";
		log.info("In2iGui initialized");
		path = Core.getInstance().getConfiguration().getBaseDir();
	}

	public void display(String xmlData, String[] elements, HttpServletResponse response) throws IOException {
		log.info("In2iGui-template-count: " + templates.size());
		response.setContentType("text/html");
		OutputStream stream = response.getOutputStream();
		try {
			StringReader xmlReader = new StringReader("<?xml version=\"1.0\"?>" + xmlData);
			Transformer transformer = getTransformer(elements, skin, iconSet);
			transformer.transform(new StreamSource(xmlReader), new StreamResult(stream));
		} catch (TransformerFactoryConfigurationError e) {
			e.printStackTrace(new PrintStream(stream));
		} catch (TransformerConfigurationException e) {
			e.printStackTrace(new PrintStream(stream));
		} catch (TransformerException e) {
			try {
				new OutputStreamWriter(stream).write("<?xml version=\"1.0\"?><error><message>" + escape(e.getMessage())
						+ "</message><gui>" + xmlData + "</gui></error>");
			} catch (IOException ex) {
				log.error(ex.getMessage(), ex);
			}
		}
	}

	private Transformer getTransformer(String[] elements, String skin, String iconset)
			throws TransformerFactoryConfigurationError, TransformerConfigurationException {
		Arrays.sort(elements);
		String key = Arrays.toString(elements);
		Templates temp = (Templates) templates.get(key);
		if (temp == null) {
			StringBuffer xslString = new StringBuffer();
			xslString
					.append("<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>"
							+ "<xsl:stylesheet xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\" xmlns:xalan=\"http\u003a//xml.apache.org/xslt\" version=\"1.0\">"
							+ "<xsl:output method=\"html\" encoding=\"ISO-8859-1\" indent=\"no\" xalan:use-url-escaping=\"no\"/>"
							+ "<xsl:include href=\"" + path + "/XmlWebGui/Skins/" + skin + "/Main.xsl\"/>");
			for (int i = 0; i < elements.length; i++) {
				xslString.append("<xsl:include href=\"" + path + "/XmlWebGui/Skins/" + skin + "/Include/" + elements[i]
						+ ".xsl\"/>");
			}
			xslString.append("<xsl:template match=\"/\"><xsl:apply-templates/></xsl:template>" + "</xsl:stylesheet>");
			StringReader xslReader = new StringReader(xslString.toString());
			temp = tFactory.newTemplates(new StreamSource(xslReader));
			templates.put(key, temp);
			log.info("New template!");
		}
		return temp.newTransformer();
	}

	public static String escape(String output) {
		if (output == null) {
			return "";
		} else if (output.length() > 0) {
			output = replace(output, "&", "&amp;");
			output = replace(output, "<", "&#60;");
			output = replace(output, ">", "&#62;");
			output = replace(output, "\"", "&#34;");
			return output;
		} else {
			return output;
		}
	}

	private static String replace(String str, String pattern, String replace) {
		int s = 0;
		int e = 0;
		StringBuffer result = new StringBuffer();

		while ((e = str.indexOf(pattern, s)) >= 0) {
			result.append(str.substring(s, e));
			result.append(replace);
			s = e + pattern.length();
		}
		result.append(str.substring(s));
		return result.toString();
	}
}
