package dk.in2isoft.commons.http;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.httpclient.DefaultHttpMethodRetryHandler;
import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.params.HttpMethodParams;

public class FileDownload {
	
	//private static Logger log = Logger.getLogger(FileDownload.class);
	
	private String contentType;
	
	public void download(String url, File tempFile)
	throws IOException {


		HttpClient client = new HttpClient();

		// Create a method instance.
		GetMethod method = new GetMethod(url);

		// Provide custom retry handler is necessary
		method.getParams().setParameter(HttpMethodParams.RETRY_HANDLER, new DefaultHttpMethodRetryHandler(3, false));

		try {
			// Execute the method.
			int statusCode = client.executeMethod(method);

			if (statusCode != HttpStatus.SC_OK) {
				throw new IOException("Method failed: " + method.getStatusLine());
			}
			Header contentTypeHeader = method.getResponseHeader("Content-Type");
			if (contentTypeHeader!=null) {
				contentType = contentTypeHeader.getValue();
			}
			
			InputStream stream = method.getResponseBodyAsStream();
			FileOutputStream output = new FileOutputStream(tempFile);
			int c;
			while ((c = stream.read()) != -1) {
				output.write(c);
			}
			stream.close();
			output.close();
		} catch (HttpException e) {
			throw new IOException(e.toString());
		} finally {
			// Release the connection.
			method.releaseConnection();
		}
	}

	public String getContentType() {
		return contentType;
	}
}
