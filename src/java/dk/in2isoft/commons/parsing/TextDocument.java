package dk.in2isoft.commons.parsing;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;

import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.io.IOUtils;

import dk.in2isoft.commons.http.HeaderUtil;

public class TextDocument {

	protected URL url;
	private String raw;
	
	public TextDocument(URL url) {
		super();
		this.url=url;
	}
	
	public TextDocument(String url) throws MalformedURLException {
		this.url=new URL(url);
	}
	
	public boolean canRead() {
		try {
			InputStream stream = this.url.openStream();
			stream.close();
			return true;
		}
		catch(IOException e) {
			return false;
		}
	}
	
	public String getRawString() {
		if (raw!=null) {
			return raw;
		}
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
			reader = new InputStreamReader(input,encoding);
			raw = IOUtils.toString(reader);
		} catch (IOException e) {
		} catch (URISyntaxException e) {
		} finally {
			IOUtils.closeQuietly(input);
			IOUtils.closeQuietly(reader);
			if (method!=null) {
				method.releaseConnection();
			}
		}
		return raw;
	}
}
