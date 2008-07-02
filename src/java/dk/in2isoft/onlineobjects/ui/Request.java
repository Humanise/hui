package dk.in2isoft.onlineobjects.ui;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.ArrayUtils;

import dk.in2isoft.commons.lang.LangUtil;
import dk.in2isoft.onlineobjects.core.UserSession;

public class Request {

	private HttpServletRequest request;
	private HttpServletResponse response;
	private int level;
	private String[] fullPath;
	private String[] localContext;
	
	public Request(HttpServletRequest request, HttpServletResponse response) {
		super();
		this.response = response;
		this.request = request;
		this.decodePath();
		this.localContext = new String[] {};
	}
	
	public void setLocalContext(String[] localContext) {
		this.localContext = localContext;
	}
	
	public String[] getLocalContext() {
		return this.localContext;
	}
	
	public String getLocalContextPath() {
		String context = request.getContextPath();
		if (localContext.length==0) {
			return context;
		} else {
			return context+"/"+LangUtil.implode(localContext,"/");
		}
	}

	private void decodePath() {
		String context = request.getContextPath();
		String uri = request.getRequestURI().substring(context.length() + 1);
		if (uri.length()==0) {
			this.level = 0;
			this.fullPath = new String[]{};
		} else {
			String[] path = uri.split("/");
			int level = path.length;
			if (!uri.endsWith("/") || uri.length() == 0) {
				level--;
			}
			this.level = level;
			this.fullPath = path;
		}
	}
	
	public HttpServletRequest getRequest() {
		return request;
	}

	public HttpServletResponse getResponse() {
		return response;
	}
	
	public String getRelativePath() {
		StringBuilder path = new StringBuilder();
		for (int i = 0; i < level; i++) {
			path.append("../");
		}
		return path.toString();
	}

	public String[] getFullPath() {
		return fullPath;
	}

	public String[] getLocalPath() {
		return (String[]) ArrayUtils.subarray(fullPath, this.localContext.length, fullPath.length);
	}
	
	public boolean testLocalPathStart(String... path) {
		String[] localPath = getLocalPath();
		if (path.length>localPath.length) {
			return false;
		}
		for (int i = 0; i < path.length; i++) {
			if (path[i]!=null && !path[i].equals(localPath[i])) {
				return false;
			}
		}
		return true;
	}
	
	public boolean testLocalPathFull(String... path) {
		String[] localPath = getLocalPath();
		if (path.length!=localPath.length) {
			return false;
		}
		for (int i = 0; i < path.length; i++) {
			if (path[i]!=null && !path[i].equals(localPath[i])) {
				return false;
			}
		}
		return true;
	}
	
	public boolean isSet(String key) {
		return getString(key).length()>0;
	}

	public String getString(String key) {
		String value = request.getParameter(key);
		if (value==null) {
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

	public String getString(String key, String error)
	throws IllegalArgumentException {
		String value = request.getParameter(key);
		if (value==null) {
			throw new IllegalArgumentException(error);
		} else {
			return value;
		}
	}
	
	public String getParameter(String key) {
		return request.getParameter(key);
	}
	
	public void redirect(String url)
	throws IOException {
		response.sendRedirect(url);
	}
	
	public UserSession getSession() {
		Object session = request.getSession().getAttribute(UserSession.SESSION_ATTRIBUTE);
		return (UserSession) session;
	}

	public String getBaseContextPath() {
		return request.getContextPath();
	}
}
