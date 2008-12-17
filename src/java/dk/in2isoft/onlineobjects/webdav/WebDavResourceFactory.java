package dk.in2isoft.onlineobjects.webdav;

import com.bradmcevoy.common.Path;
import com.bradmcevoy.http.Resource;
import com.bradmcevoy.http.ResourceFactory;

public class WebDavResourceFactory implements ResourceFactory {

	public Resource getResource(String host, String url) {
		Path path = Path.path(url);
		return null;
	}

	public String getSupportedLevels() {
		return "1";
	}

}
