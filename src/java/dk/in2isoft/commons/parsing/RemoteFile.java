package dk.in2isoft.commons.parsing;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;

public class RemoteFile {

	protected URL url;
	
	public RemoteFile(URL url) {
		super();
		this.url=url;
	}
	
	public RemoteFile(String url) throws MalformedURLException {
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
}
