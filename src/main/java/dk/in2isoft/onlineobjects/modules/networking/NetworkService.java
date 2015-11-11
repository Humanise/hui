package dk.in2isoft.onlineobjects.modules.networking;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.log4j.Logger;

import dk.in2isoft.commons.http.HeaderUtil;
import dk.in2isoft.commons.lang.Files;
import dk.in2isoft.onlineobjects.modules.networking.NetworkResponse.State;

public class NetworkService {
	
	private static final Logger log = Logger.getLogger(NetworkService.class);
	
	public String getStringSilently(String url) {
		try {
			return getString(new URL(url));
		} catch (MalformedURLException e) {
			log.error(e.getMessage(), e);
		} catch (IOException e) {
			log.error(e.getMessage(), e);
		} catch (URISyntaxException e) {
			log.error(e.getMessage(), e);
		}
		return null;
	}

	public String getString(URL url) throws IOException, URISyntaxException {
		NetworkResponse response = null;
		try {
			response = get(url);
			if (response.isSuccess()) {
				String string = Files.readString(response.getFile(),response.getEncoding());
				return string;
			}
		} catch (IOException e) {
			throw e;
		} catch (URISyntaxException e) {
			throw e;
		} finally {
			response.cleanUp();
		}
		return null;
	}
	
	public NetworkResponse get(String spec) throws URISyntaxException, IOException {
		return get(new URL(spec));
	}
	
	public NetworkResponse getSilently(String url) {
		try {
			return get(new URL(url));
		} catch (MalformedURLException e) {
			log.error(e.getMessage(), e);
		} catch (URISyntaxException e) {
			log.error(e.getMessage(), e);
		} catch (IOException e) {
			log.error(e.getMessage(), e);
		}
		return null;
	}

	public NetworkResponse get(URL url) throws URISyntaxException, IOException {
		NetworkResponse response = new NetworkResponse();
		InputStream input = null;
		InputStreamReader reader = null;
		HttpGet method = null;
		OutputStream output = null;
		try {
			File file = File.createTempFile("networkservice", "tmp");
			file.deleteOnExit();
			String encoding = null;
			String contentType = null;
			if (url.getProtocol().equals("http") || url.getProtocol().equals("https")) {
				CloseableHttpClient client = HttpClients.createDefault();
				method = new HttpGet(url.toURI());
				method.addHeader("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36");
				CloseableHttpResponse res = client.execute(method);
				int code = res.getStatusLine().getStatusCode();
				if (code == 200) {
					org.apache.http.Header header = res.getFirstHeader("Content-Type");
					if (header!=null) {
						contentType = HeaderUtil.getContentTypesMimeType(header.getValue());
						String contentTypeEncoding = HeaderUtil.getContentTypeEncoding(header.getValue());
						if (contentTypeEncoding!=null) {
							encoding = contentTypeEncoding;
						}
					}
					response.setState(State.SUCCESS);
				}
				HttpEntity entity = res.getEntity();
				input = entity.getContent();
			} else {
				input = url.openStream();
				response.setState(State.SUCCESS);
			}
			output = new FileOutputStream(file);
			reader = new InputStreamReader(input,encoding==null ? "UTF-8" : encoding);
			IOUtils.copy(input, output);
			response.setMimeType(contentType);
			response.setEncoding(encoding);
			response.setFile(file);
			return response;
		} catch (IOException e) {
			throw e;
		} catch (URISyntaxException e) {
			throw e;
		} finally {
			IOUtils.closeQuietly(input);
			IOUtils.closeQuietly(reader);
			if (method!=null) {
				method.releaseConnection();
			}
		}		
	}
	
}
