package dk.in2isoft.commons.parsing;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;

import nu.xom.Builder;
import nu.xom.ParsingException;
import nu.xom.converters.DOMConverter;

import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;
import org.apache.xerces.dom.DOMImplementationImpl;
import org.ccil.cowan.tagsoup.Parser;
import org.w3c.dom.Document;

import dk.in2isoft.commons.http.HeaderUtil;

public class XMLDocument extends TextDocument {

	private static Logger log = Logger.getLogger(XMLDocument.class);
    private Document DOMDocument;
    private nu.xom.Document XOMDocument;
    
	public XMLDocument(URL url) {
		super(url);
	}
	
	public XMLDocument(String url) throws MalformedURLException {
		super(url);
	}
	
	public Document getDOMDocument() {
		if (DOMDocument==null) {
            nu.xom.Document xom = getXOMDocument();
            if (xom!=null) {
            	DOMDocument = DOMConverter.convert(xom,DOMImplementationImpl.getDOMImplementation());
            }
        }
	    return DOMDocument;
	}
	
	public nu.xom.Document getXOMDocument() {
		if (XOMDocument == null) {
			InputStream input = null;
			InputStreamReader reader = null;
			GetMethod method = null;
			try {
				String encoding = "UTF-8";
				if (this.url.getProtocol().equals("http")) {
					HttpClient client = new HttpClient();
					method = new GetMethod(this.url.toURI().toString());
					int code = client.executeMethod(method);
					if (code == 200) {
						Header header = method.getResponseHeader("Content-Type");
						if (header!=null) {
							String contentTypeEncoding = HeaderUtil.getContentTypeEncoding(header.getValue());
							if (contentTypeEncoding!=null) {
								encoding = contentTypeEncoding;
							}
						}
					}
					input = method.getResponseBodyAsStream();
				} else {
					input = this.url.openStream();
				}
				Parser tagsoup = new Parser();
				Builder bob = new Builder(tagsoup);
				reader = new InputStreamReader(input,encoding);
				XOMDocument = bob.build(reader);
			} catch (ParsingException e) {
				log.error(e);
			} catch (IOException e) {
				log.error(e);
			} catch (URISyntaxException e) {
				log.error(e);
			} finally {
				IOUtils.closeQuietly(input);
				IOUtils.closeQuietly(reader);
				if (method!=null) {
					method.releaseConnection();
				}
			}
		}
		return XOMDocument;
	}
}
