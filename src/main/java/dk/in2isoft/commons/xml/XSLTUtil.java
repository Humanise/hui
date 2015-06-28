package dk.in2isoft.commons.xml;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.StringReader;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import nu.xom.Serializer;

import org.apache.log4j.Logger;
import org.w3c.dom.Document;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.XSLTInterface;

public class XSLTUtil {
	
	private static Logger log = Logger.getLogger(XSLTUtil.class);

	private static void applyXSLT(Source xml, Source xslt, Result output, Map<String, String> parameters)
			throws EndUserException {
		try {
			TransformerFactory tFactory = TransformerFactory.newInstance();
			Transformer transformer = tFactory.newTransformer(xslt);
			if (transformer==null) {
				throw new EndUserException("No tranformer");
			}
			if (parameters != null) {
				for (Iterator<Entry<String, String>> iter = parameters.entrySet().iterator(); iter.hasNext();) {
					Entry<String, String> element = iter.next();
					String value = element.getValue()!=null ? element.getValue() : "";
					transformer.setParameter(element.getKey(), value);
				}
			}
			transformer.transform(xml, output);
		} catch (TransformerConfigurationException e) {
			throw new EndUserException(e);
		} catch (TransformerException e) {
			throw new EndUserException(e);
		}

	}

	private static void applyXSLT(String xmlData, Source xslt, OutputStream output, Map<String, String> parameters)
			throws EndUserException {
		StringReader xmlReader = new StringReader(xmlData);
		StreamSource xmlSource = new StreamSource(xmlReader);
		OutputStreamWriter out;
		try {
			out = new OutputStreamWriter(output, "UTF8");
		} catch (UnsupportedEncodingException e) {
			throw new EndUserException(e);
		}
		applyXSLT(xmlSource, xslt, new StreamResult(out), parameters);

	}

	private static void applyXSLT(Document doc, Source xslt, OutputStream output, Map<String, String> parameters)
			throws EndUserException {
		Source xmlSource = new DOMSource(doc.getDocumentElement());
		applyXSLT(xmlSource, xslt, new StreamResult(output), parameters);
	}

	private static void applyXSLT(Document doc, Source xslt, PrintWriter output, Map<String, String> parameters)
			throws EndUserException {
		Source xmlSource = new DOMSource(doc.getDocumentElement());
		applyXSLT(xmlSource, xslt, new StreamResult(output), parameters);
	}
	
	private static void applyXSLT(String xmlData, File[] xsltFile, OutputStream output, Map<String, String> parameters)
			throws EndUserException {
		StringReader xslReader = new StringReader(buildXSLT(xsltFile,parameters));
		applyXSLT(xmlData, new StreamSource(xslReader), output, parameters);
	}
	
	private static String buildXSLT(File[] xsltFile, Map<String, String> parameters) {
		StringBuilder xsl = new StringBuilder();
		xsl.append("<?xml version='1.0' encoding='UTF-8'?>");
		xsl.append("<xsl:stylesheet xmlns:xsl='http://www.w3.org/1999/XSL/Transform' version='1.0'>");
		xsl.append("<xsl:output method='xml' encoding='UTF-8' indent='no'/>");
		for (Iterator<String> iter = parameters.keySet().iterator(); iter.hasNext();) {
			String key = iter.next();
			xsl.append("<xsl:param name='").append(key).append("'/>");
		}
		for (int i = 0; i < xsltFile.length; i++) {
			xsl.append("<xsl:include href='").append(xsltFile[i].toURI()).append("'/>");
		}
		xsl.append("</xsl:stylesheet>");
		return xsl.toString();
	}

	public static void applyXSLT(String xmlData, File xsltFile, OutputStream output, Map<String, String> parameters)
			throws EndUserException {
		StringReader xslReader = new StringReader(buildXSLT(new File[] {xsltFile},parameters));
		applyXSLT(xmlData, new StreamSource(xslReader), output, parameters);
	}

	public static void applyXSLT(String xmlData, File xsltFile, HttpServletResponse response,
			Map<String, String> parameters) throws EndUserException, IOException {
		response.setContentType("text/html");
		applyXSLT(xmlData, new StreamSource(xsltFile), response.getOutputStream(), parameters);
	}

	public static void applyXSLT(String xmlData, File xsltFile, OutputStream output) throws EndUserException {
		applyXSLT(xmlData, xsltFile, output, null);
	}

	public static void applyXSLT(XSLTInterface ui, Request request) throws EndUserException, IOException {
		if (request.getBoolean("source")) {
			writeSource(ui,request);
			return;
		}
		HttpServletResponse response = request.getResponse();
		Map<String, String> parameters = new HashMap<String, String>();
		parameters.put("local-context", request.getLocalContext());
		parameters.put("base-domain-context", request.getBaseDomainContext());
		parameters.put("domain-is-ip", String.valueOf(request.isIP()));
		parameters.put("base-context", request.getBaseContext());
		parameters.put("user-name", request.getSession().getUser().getUsername());
		parameters.put("development-mode", String.valueOf(Core.getInstance().getConfigurationService().isDevelopmentMode()));
		response.setCharacterEncoding(Strings.UTF8);
		if (isXhtmlCapable(request.getRequest())) {
			response.setContentType("application/xhtml+xml");
		} else {
			response.setContentType("text/html");
		}
		Document data = ui.getData();
		try {
			applyXSLT(data, new StreamSource(ui.getStylesheet()), response.getOutputStream(), parameters);
		} catch (IllegalStateException e) {
			applyXSLT(data, new StreamSource(ui.getStylesheet()), response.getWriter(), parameters);
		}
	}

	private static void writeSource(XSLTInterface ui, Request request) throws IOException, ModelException {
		request.getResponse().setContentType("text/xml");
		Serializer serializer = new Serializer(request.getResponse().getOutputStream());
		serializer.write(ui.getDocument());
	}

	public static void applyXSLT(String xmlData, File[] xsltFile, HttpServletResponse response,
			Map<String, String> parameters) throws EndUserException, IOException {
		response.setContentType("text/html");
		applyXSLT(xmlData, xsltFile, response.getOutputStream(), parameters);
	}

	private static boolean isXhtmlCapable(HttpServletRequest request) {
		String accept = request.getHeader("Accept");
		log.debug("Accept: "+accept);
		return (accept != null && accept.indexOf("application/xhtml+xml")!=-1);
	}
}
