package dk.in2isoft.onlineobjects.ui;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

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
	
	private long startTime;
	
	private String language;
	
	private String domainName;
	
	private Request(HttpServletRequest request, HttpServletResponse response) {
		super();
		this.response = response;
		this.request = request;
		this.decode();
		this.localContext = new String[] {};
		this.startTime = System.currentTimeMillis();
		//debug();
	}
	
	public static Request get(HttpServletRequest request, HttpServletResponse response) {
		Request attribute = (Request) request.getAttribute("OnlineObjectsRequest");
		if (attribute==null) {
			attribute = new Request(request, response);
			request.setAttribute("OnlineObjectsRequest", attribute);
		}
		return attribute;
	}
	
	private synchronized void debug() {
		log.info("------------ new request ------------");
		log.info("requestUri: "+request.getRequestURI());
		log.info("requestUrl: "+request.getRequestURL());
		log.info("queryString: "+request.getQueryString());
		log.info("serverName: "+request.getServerName());
		log.info("localName: "+request.getLocalName());
		log.info("contextPath: "+request.getContextPath());
		log.info("method: "+request.getMethod());
		log.info("remoteHost: "+request.getRemoteHost());
		log.info("remoteAddr: "+request.getRemoteAddr());
		log.info("pathInfo: "+request.getPathInfo());
		log.info("pathTranslated: "+request.getPathTranslated());
		log.info("------------");
	}

	private void decode() {
		domainName = request.getServerName();
		baseContext = request.getContextPath();
		String uri = request.getServletPath().substring(1);
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
		language = "en";
	}
	
	public String getLanguage() {
		return language;
	}
	
	public void setLanguage(String language) {
		this.language = language;
	}

	public void setLocalContext(String[] localContext) {
		this.localContext = localContext;
	}

	public String getBaseContext() {
		return this.baseContext;
	}

	public String getSubDomain() {
		if (isIP()) {
			return null;
		}
		if (domainName==null) {
			return null;
		}
		String[] parts = domainName.split("\\.");
		if (parts.length < 2)
			return null;
		Object[] sub = ArrayUtils.subarray(parts, 0, parts.length - 2);
		return StringUtils.join(sub, ".");
	}

	
	public String getDomainName() {
		return domainName;
	}
	
	public boolean isIP() {
		return domainName!=null && domainName.matches("[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+");
	}

	public String getBaseDomain() {
		if (isIP()) {
			return null;
		}
		if (domainName==null) {
			return null;
		}
		String[] parts = domainName.split("\\.");
		if (parts.length < 2) {
			return null;
		}
		Object[] sub = ArrayUtils.subarray(parts, parts.length - 2, parts.length);
		return StringUtils.join(sub, ".");
	}

	public String getLocalContext() {
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
		String[] localPath = getLocalPath();
		return "/"+StringUtils.join(localPath,"/");
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
		if (session==null) {
			log.error("The user session is not set!");
		}
		return (UserSession) session;
	}

	public boolean isUser(String username) {
		return username.equals(getSession().getUser().getUsername());
	}

	public boolean hasDomain() {
		return !request.getLocalName().equals(request.getLocalAddr());
	}

	public String getBaseDomainContext() {
		StringBuilder context = new StringBuilder();
		String baseDomain = getBaseDomain();
		if (baseDomain!=null) {
			context.append(baseDomain);			
		} else {
			context.append(domainName);
		}
		if (request.getLocalPort() != 80) {
			context.append(":").append(request.getLocalPort());
		}
		context.append(request.getContextPath());
		return context.toString();
	}

	public void redirectFromBase(String redirect) throws IOException {
		redirect(baseContext + redirect);
	}

	@SuppressWarnings("unchecked")
	public <T> T getBean(Class<T> beanClass) {
		String name = beanClass.getSimpleName().substring(0, 1).toLowerCase()+beanClass.getSimpleName().substring(1);
		WebApplicationContext applicationContext = WebApplicationContextUtils.getWebApplicationContext(request.getSession().getServletContext());
		return (T) applicationContext.getBean(name, beanClass);
	}
	
	public long getStartTime() {
		return startTime;
	}

	public long getRunningTime() {
		return System.currentTimeMillis()-startTime;
	}
}
