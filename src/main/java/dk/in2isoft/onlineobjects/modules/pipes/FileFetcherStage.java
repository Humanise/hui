package dk.in2isoft.onlineobjects.modules.pipes;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.URI;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.io.IOUtils;

public class FileFetcherStage extends PipelineStageAdapter {

	private String url;

	public FileFetcherStage(String url) {
		this.url = url;
	}

	public void run() {
		HttpClient client = new HttpClient();
		HttpMethod method = new GetMethod();
		File temp = null; 
		OutputStream outputStream = null;
		try {
			context.info(this, "Starting");
			method.setURI(new URI(url,true));
			client.executeMethod(method);
			method.getResponseBodyAsStream();
			temp = File.createTempFile(getClass().getName(), "txt");
			outputStream = new FileOutputStream(temp);
			IOUtils.copy(method.getResponseBodyAsStream(), outputStream);
			context.info(this, "Finished");
			context.forvardFile(temp);
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (temp!=null) {
				temp.delete();
				context.info(this, "Cleaning");
			}
		}
		
	}
}
