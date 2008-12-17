package dk.in2isoft.onlineobjects.webdav;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Date;
import java.util.Map;

import com.bradmcevoy.http.Auth;
import com.bradmcevoy.http.GetableResource;
import com.bradmcevoy.http.Range;
import com.bradmcevoy.http.Request;
import com.bradmcevoy.http.Resource;
import com.bradmcevoy.http.Request.Method;

public class WedDavResource implements GetableResource {

	private String content = "Hep hey!";
	
	public Long getContentLength() {
		return new Long(content.getBytes().length);
	}

	public String getContentType(String arg0) {
		// TODO Auto-generated method stub
		return null;
	}

	public Long getMaxAgeSeconds() {
		// TODO Auto-generated method stub
		return null;
	}

	public void sendContent(OutputStream arg0, Range arg1, Map<String, String> arg2) throws IOException {
		// TODO Auto-generated method stub
		
	}

	public Object authenticate(String arg0, String arg1) {
		// TODO Auto-generated method stub
		return null;
	}

	public boolean authorise(Request arg0, Method arg1, Auth arg2) {
		return true;
	}

	public String checkRedirect(Request arg0) {
		// TODO Auto-generated method stub
		return null;
	}

	public Date getModifiedDate() {
		return null;
	}

	public String getName() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getRealm() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getUniqueId() {
		return "";
	}

	public int compareTo(Resource o) {
		return 0;
	}

}
