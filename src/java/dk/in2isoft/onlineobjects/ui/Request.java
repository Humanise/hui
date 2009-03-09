package dk.in2isoft.onlineobjects.ui;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import dk.in2isoft.commons.lang.LangUtil;
import dk.in2isoft.onlineobjects.core.UserSession;

public class Request {

	private static Logger log = Logger.getLogger(Request.class);

	private HttpServletRequest request;

	private HttpServletResponse response;

	private int level;

	private String[] fullPath;

	private String[] localContext;

	private String baseContext;

	private String relativePath;

	private URI uri;

	public Request(HttpServletRequest request, HttpServletResponse response) {
		super();
		this.response = response;
		this.request = request;
		this.decode();
		this.localContext = new String[] {};
	}

	private void decode() {
		baseContext = request.getContextPath();
		String uri = request.getRequestURI().substring(baseContext.length() + 1);
		if (uri.indexOf(";jsessionid=") != -1) {
			uri = uri.substring(0, uri.indexOf(";jsessionid="));
		}
		if (uri.length() == 0) {
			this.level = 0;
			this.fullPath = new String[] {};
		} else {
			String[] path = uri.split("/");
			int level = path.length;
			if (!uri.endsWith("/") || uri.length() == 0) {
				level--;
			}
			this.level = level;
			this.fullPath = path;
		}
		StringBuilder path = new StringBuilder();
		for (int i = 0; i < level; i++) {
			path.append("../");
		}
		relativePath = path.toString();
		try {
			this.uri = new URI(request.getRequestURL().toString());
		} catch (URISyntaxException e) {
			log.warn("Unable to parse url",e);
		}
	}

	public void setLocalContext(String[] localContext) {
		this.localContext = localContext;
	}

	public String getBaseContext() {
		return this.baseContext;
	}

	public String[] getLocalContext() {
		return this.localContext;
	}

	public String getSubDomain() {
		if (isIP()) {
			return null;
		}
		String host = uri.getHost();
		String[] parts = host.split("\\.");
		if (parts.length < 2)
			return null;
		Object[] sub = ArrayUtils.subarray(parts, 0, parts.length - 2);
		return StringUtils.join(sub, ".");
	}

	public String getDomainName() {
		String host = uri.getHost();
		return host;
	}
	
	public boolean isIP() {
		return uri.getHost().matches("[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+");
	}

	public String getBaseDomain() {
		if (isIP()) {
			return null;
		}
		String host = getDomainName();
		String[] parts = host.split("\\.");
		if (parts.length < 2)
			return null;
		Object[] sub = ArrayUtils.subarray(parts, parts.length - 2, parts.length);
		return StringUtils.join(sub, ".");
	}

	public String getLocalContextPath() {
		String context = request.getContextPath();
		if (localContext.length == 0) {
			return context;
		} else {
			return context + "/" + LangUtil.implode(localContext, "/");
		}
	}

	public HttpServletRequest getRequest() {
		return request;
	}

	public HttpServletResponse getResponse() {
		return response;
	}

	public String getRelativePath() {
		return relativePath;
	}

	public String[] getFullPath() {
		return fullPath;
	}

	public String[] getLocalPath() {
		return (String[]) ArrayUtils.subarray(fullPath, this.localContext.length, fullPath.length);
	}
	
	public String getLocalPathAsString() {
		return StringUtils.join(getLocalPath(),"/");
	}

	public boolean testLocalPathStart(String... path) {
		String[] localPath = getLocalPath();
		if (path.length > localPath.length) {
			return false;
		}
		for (int i = 0; i < path.length; i++) {
			if (path[i] != null && !path[i].equals(localPath[i])) {
				return false;
			}
		}
		return true;
	}

	public boolean testLocalPathFull(String... path) {
		String[] localPath = getLocalPath();
		if (path.length != localPath.length) {
			return false;
		}
		for (int i = 0; i < path.length; i++) {
			if (path[i] != null && !path[i].equals(localPath[i])) {
				return false;
			}
		}
		return true;
	}

	public boolean isSet(String key) {
		return getString(key).length() > 0;
	}

	public String getString(String key) {
		String value = request.getParameter(key);
		if (value == null) {
			return "";
		} else {
			return value;
		}
	}

	public Long getLong(String key) {
		String value = request.getParameter(key);
		try {
			return Long.parseLong(value);
		} catch (NumberFormatException e) {
			return new Long(0);
		}
	}

	public int getInt(String key) {
		String value = request.getParameter(key);
		try {
			return Integer.parseInt(value);
		} catch (NumberFormatException e) {
			return 0;
		}
	}

	public boolean getBoolean(String key) {
		return "true".equals(request.getParameter(key));
	}

	public String getString(String key, String error) throws IllegalArgumentException {
		String value = request.getParameter(key);
		if (value == null) {
			throw new IllegalArgumentException(error);
		} else {
			return value;
		}
	}

	public String getParameter(String key) {
		return request.getParameter(key);
	}

	public void redirect(String url) throws IOException {
		response.sendRedirect(url);
	}

	public UserSession getSession() {
		Object session = request.getSession().getAttribute(UserSession.SESSION_ATTRIBUTE);
		return (UserSession) session;
	}

	public boolean isUser(String username) {
		return username.equals(getSession().getUser().getUsername());
	}

	public String getBaseContextPath() {
		return request.getContextPath();
	}

	public boolean hasDomain() {
		return !request.getLocalName().equals(request.getLocalAddr());
	}

	public String getBaseDomainContext() {
		StringBuilder x = new StringBuilder();
		String baseDomain = getBaseDomain();
		if (baseDomain!=null) {
			x.append(baseDomain);			
		} else {
			x.append(uri.getHost());
		}
		if (request.getLocalPort() != 80) {
			x.append(":").append(request.getLocalPort());
		}
		x.append(request.getContextPath());
		return x.toString();
	}

	public void redirectFromBase(String redirect) throws IOException {
		redirect(baseContext + redirect);
	}
}
