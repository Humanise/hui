package dk.in2isoft.commons.xml;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.StringReader;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.w3c.dom.Document;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.XSLTInterface;

public class XSLTUtil {

	private static void applyXSLT(Source xml, Source xslt, OutputStream output, Map<String, String> parameters)
			throws EndUserException {
		try {

			TransformerFactory tFactory = TransformerFactory.newInstance();
			Transformer transformer = tFactory.newTransformer(xslt);
			if (parameters != null) {
				for (Iterator<Entry<String, String>> iter = parameters.entrySet().iterator(); iter.hasNext();) {
					Entry<String, String> element = iter.next();
					transformer.setParameter(element.getKey(), element.getValue());
				}
			}
			StreamResult scrResult = new StreamResult(output);
			transformer.transform(xml, scrResult);
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
		applyXSLT(xmlSource, xslt, output, parameters);

	}

	private static void applyXSLT(Document doc, Source xslt, OutputStream output, Map<String, String> parameters)
			throws EndUserException {
		Source xmlSource = new DOMSource(doc.getDocumentElement());
		applyXSLT(xmlSource, xslt, output, parameters);
	}

	public static void applyXSLT(Document doc, File xsltFile, OutputStream output, Map<String, String> parameters)
			throws EndUserException {
		applyXSLT(doc, new StreamSource(xsltFile), output, parameters);
	}

	public static void applyXSLT(String xmlData, File[] xsltFile, OutputStream output, Map<String, String> parameters)
			throws EndUserException {
		StringBuilder xsl = new StringBuilder();
		xsl.append("<?xml version='1.0' encoding='ISO-8859-1'?>");
		xsl.append("<xsl:stylesheet xmlns:xsl='http://www.w3.org/1999/XSL/Transform' version='1.0'>");
		xsl.append("<xsl:output method='html' encoding='ISO-8859-1' indent='no'/>");
		for (Iterator<String> iter = parameters.keySet().iterator(); iter.hasNext();) {
			String key = iter.next();
			xsl.append("<xsl:param name='").append(key).append("'/>");
		}
		for (int i = 0; i < xsltFile.length; i++) {
			xsl.append("<xsl:include href='").append(xsltFile[i].toURI()).append("'/>");
		}
		xsl.append("</xsl:stylesheet>");
		StringReader xslReader = new StringReader(xsl.toString());
		applyXSLT(xmlData, new StreamSource(xslReader), output, parameters);
	}

	public static void applyXSLT(String xmlData, File xsltFile, OutputStream output, Map<String, String> parameters)
			throws EndUserException {
		applyXSLT(xmlData, new StreamSource(xsltFile), output, parameters);
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
		HttpServletResponse response = request.getResponse();
		Map<String, String> parameters = new HashMap<String, String>();
		parameters.put("app-context", request.getLocalContextPath());
		parameters.put("base-context", request.getBaseContextPath());
		parameters.put("user-name", request.getSession().getUser().getUsername());
		if (isXhtmlCapable(request.getRequest())) {
			response.setContentType("application/xhtml+xml");
		} else {
			response.setContentType("text/html");
		}
		XSLTUtil.applyXSLT(ui.getData(), ui.getStylesheet(), response.getOutputStream(), parameters);
	}

	public static void applyXSLT(String xmlData, File[] xsltFile, HttpServletResponse response,
			Map<String, String> parameters) throws EndUserException, IOException {
		response.setContentType("text/html");
		applyXSLT(xmlData, xsltFile, response.getOutputStream(), parameters);
	}

	private static boolean isXhtmlCapable(HttpServletRequest request) {
		String accept = request.getHeader("Accept");
		if (accept == null) {
			return false;
		} else {
			return accept.indexOf("application/xhtml+xml") != -1;
		}
	}
}
