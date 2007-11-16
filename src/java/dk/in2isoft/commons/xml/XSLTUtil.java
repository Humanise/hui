package dk.in2isoft.commons.xml;

import java.io.File;
import java.io.OutputStream;
import java.io.StringReader;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.XSLTInterface;

public class XSLTUtil {

	private static void applyXSLT(String xmlData, Source xslt, OutputStream output, Map<String, String> parameters)
			throws EndUserException {
		try {
			StringReader xmlReader = new StringReader(xmlData);
			StreamSource xmlSource = new StreamSource(xmlReader);

			TransformerFactory tFactory = TransformerFactory.newInstance();
			Transformer transformer = tFactory.newTransformer(xslt);
			if (parameters != null) {
				for (Iterator<Entry<String,String>> iter = parameters.entrySet().iterator(); iter.hasNext();) {
					Entry<String, String> element = iter.next();
					transformer.setParameter(element.getKey(), element.getValue());
				}
			}
			transformer.setParameter("user-name", "jbm");
			StreamResult scrResult = new StreamResult(output);
			transformer.transform(xmlSource, scrResult);
		} catch (TransformerConfigurationException e) {
			throw new EndUserException(e);
		} catch (TransformerException e) {
			throw new EndUserException(e);
		}

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

	public static void applyXSLT(String xmlData, File xsltFile, OutputStream output) throws EndUserException {
		applyXSLT(xmlData, xsltFile, output, null);
	}

	public static void applyXSLT(XSLTInterface ui, OutputStream output) throws EndUserException {
		XSLTUtil.applyXSLT(ui.getData(), ui.getStylesheet(), output);
	}
}
