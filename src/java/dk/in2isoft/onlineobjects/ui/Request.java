package dk.in2isoft.onlineobjects.ui;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.ArrayUtils;

import dk.in2isoft.onlineobjects.core.UserSession;

public class Request {

	private HttpServletRequest request;
	private HttpServletResponse response;
	private int level;
	private String[] path;
	
	public Request(HttpServletRequest request, HttpServletResponse response) {
		super();
		this.response = response;
		this.request = request;
		this.decodePath();
	}

	private void decodePath() {
		String context = request.getContextPath();
		String uri = request.getRequestURI().substring(context.length() + 1);
		String[] path = uri.split("/");
		int level = path.length;
		if (!uri.endsWith("/") || uri.length() == 0) {
			level--;
		}
		this.level = level;
		this.path = path;
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

	public String[] getPath() {
		return path;
	}

	public String[] getApplicationPath() {
		return (String[]) ArrayUtils.subarray(path, 2, path.length+1);
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
}
