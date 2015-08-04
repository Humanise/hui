package dk.in2isoft.commons.xml;

import java.io.File;

import javax.xml.transform.OutputKeys;
import javax.xml.transform.Result;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.TransformerFactoryConfigurationError;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import nu.xom.Document;
import nu.xom.converters.DOMConverter;

import org.apache.xerces.dom.DOMImplementationImpl;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.bootstrap.DOMImplementationRegistry;
import org.w3c.dom.ls.DOMImplementationLS;
import org.w3c.dom.ls.LSException;
import org.w3c.dom.ls.LSSerializer;

public class Serializing {

	
	public static void writeAsXHTML(Document document, File file) {
		// Create an "identity" transformer - copies input to output
		Transformer t;
		try {
			t = TransformerFactory.newInstance().newTransformer();
			// for "XHTML" serialization, use the output method "xml"
			// and set publicId as shown
			t.setOutputProperty(OutputKeys.METHOD, "xml");

			t.setOutputProperty(OutputKeys.DOCTYPE_PUBLIC, "-//W3C//DTD XHTML 1.0 Transitional//EN");

			t.setOutputProperty(OutputKeys.DOCTYPE_SYSTEM, "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd");

			// For "HTML" serialization, use
			t.setOutputProperty(OutputKeys.METHOD, "html");

			// Serialize DOM tree
			org.w3c.dom.Document domDoc = DOMConverter.convert(document, DOMImplementationImpl.getDOMImplementation());
			Result result = new StreamResult(file);
			t.transform(new DOMSource(domDoc), result);
		} catch (TransformerConfigurationException e) {
			
		} catch (TransformerFactoryConfigurationError e) {
			
		} catch (TransformerException e) {
			
		}
	}
	
	public static String toString(org.w3c.dom.Document doc) {
		try {
			DOMImplementationRegistry reg = DOMImplementationRegistry.newInstance();
			DOMImplementationLS impl = (DOMImplementationLS) reg.getDOMImplementation("LS");
			LSSerializer serializer = impl.createLSSerializer();
			return serializer.writeToString(doc);
		} catch (Exception e) {
			return null;
		}
	}

	public static String toString(NodeList nodes) {
		StringBuilder str = new StringBuilder();
			DOMImplementationRegistry reg;
			try {
				reg = DOMImplementationRegistry.newInstance();
				DOMImplementationLS impl = (DOMImplementationLS) reg.getDOMImplementation("LS");
				LSSerializer serializer = impl.createLSSerializer();
				for (int i = 0; i < nodes.getLength(); i++) {
					Node node = nodes.item(i);
					try {
						str.append(serializer.writeToString(node));
					} catch (LSException e) {
						//TODO: It looks like text nodes cannot be serialized
						//str.append("<!-- "+node.getNodeValue()+" : "+e.getMessage()+" -->");
					}
				}
			} catch (ClassNotFoundException | InstantiationException
					| IllegalAccessException | ClassCastException e) {
				// TODO Auto-generated catch block
			}
			return str.toString().replaceFirst("<\\?[^\\?]+\\?>[\n ]*", "");
	}
}
