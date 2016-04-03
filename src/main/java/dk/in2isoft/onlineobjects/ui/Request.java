package dk.in2isoft.onlineobjects.ui;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Enumeration;
import java.util.List;
import java.util.Locale;

import javax.faces.context.FacesContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.eclipse.jdt.annotation.NonNull;
import org.eclipse.jdt.annotation.Nullable;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.google.common.collect.Lists;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.modules.language.WordModification;

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
	
	private Locale locale;
	
	private String domainName;
	
	private String application;

	private String uri;
	
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
	
	public synchronized void debug() {
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
		String contextPath = request.getContextPath();
		String requestURI = request.getRequestURI();
		uri = requestURI.substring(contextPath.length()+1);
		if (uri.indexOf(";jsessionid=") != -1) {
			uri = uri.substring(0, uri.indexOf(";jsessionid="));
		}
		if (uri.length() == 0) {
			this.level = 0;
			this.fullPath = new String[] {};
		} else {
			String[] path = uri.split("/");
			for (int i = 0; i < path.length; i++) {
				path[i] = Strings.decodeURL(path[i]);
			}
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
		locale = new Locale("en");
		this.uri = uri;
	}
	
	public String getLanguage() {
		return locale.getLanguage();
	}
	
	public String getUri() {
		return uri;
	}
	
	public void setLanguage(String language) {
		if (!locale.getLanguage().equals(language)) {			
			this.locale = new Locale(language);
		}
	}
	
	public Locale getLocale() {
		return locale;
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
			return context + "/" + Strings.implode(localContext, "/");
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
	
	public List<String> getStrings(String name) {
		List<String> strings = Lists.newArrayList();
		String[] values = request.getParameterValues(name);
		if (values!=null) {
			for (String value : values) {
				if (Strings.isNotBlank(value)) {
					strings.add(value);
				}
			}
		}
		return strings;
	}

	public Long getLong(String key) {
		return getLong(key, 0l);
	}

	public List<Long> getLongsByComma(String key) {
		List<Long> found = Lists.newArrayList();
		String str = getString(key);
		String[] parts = str.split(",");
		for (String string : parts) {
			try {
				found.add(Long.parseLong(string));
			} catch (NumberFormatException e) {
				// ignore
			}
		}
		return found;
	}
	
	public List<Long> getLongs(String key) {
		List<Long> found = Lists.newArrayList();
		String[] values = request.getParameterValues(key);
		if (values!=null) {
			for (String value : values) {
				try {
					found.add(Long.parseLong(value));
				} catch (NumberFormatException e) {
					// ignore
				}			
			}
		}
		return found;
	}
	
	/**
	 * The request parameter "id" as a positive Long or null if invalid
	 * @return
	 */
	public Long getId(Long dflt) {
		Long id = getLong("id", dflt);
		if (id!=null && id<1) {
			id = null;
		}
		return id;
	}
	
	public Long getId() throws IllegalRequestException {
		Long id = getId(null);
		if (id == null) {
			throw new IllegalRequestException("No id");
		}
		return id;
	}
	
	public Long getLong(String key, Long whenNullOrInvalid) {
		String value = request.getParameter(key);
		if (Strings.isBlank(value)) {
			return whenNullOrInvalid;
		}
		try {
			return Long.parseLong(value);
		} catch (NumberFormatException e) {
			return whenNullOrInvalid;
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

	public float getFloat(String key) {
		String value = request.getParameter(key);
		if (Strings.isBlank(value)) {
			return 0f;
		}
		try {
			return Float.parseFloat(value);
		} catch (NumberFormatException e) {
			return 0f;
		}
	}

	public boolean getBoolean(String key) {
		return "true".equals(request.getParameter(key));
	}

	public Boolean getBoolean(String key, Boolean whenNullOrInvalid) {
		String value = request.getParameter(key);
		if ("false".equals(value)) {
			return false;
		} else if ("true".equals(value)) {
			return true;
		}
		return whenNullOrInvalid;
	}

	public String getString(String key, String error) throws IllegalRequestException {
		String value = request.getParameter(key);
		if (Strings.isBlank(value)) {
			throw new IllegalRequestException(error);
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

	public <T> T getBean(Class<T> beanClass) {
		String name = beanClass.getSimpleName().substring(0, 1).toLowerCase()+beanClass.getSimpleName().substring(1);
		WebApplicationContext applicationContext = WebApplicationContextUtils.getWebApplicationContext(request.getSession().getServletContext());
		return applicationContext.getBean(name, beanClass);
	}
	
	public long getStartTime() {
		return startTime;
	}

	public long getRunningTime() {
		return System.currentTimeMillis()-startTime;
	}

	public static Request get(FacesContext context) {
		HttpServletRequest request = (HttpServletRequest) context.getExternalContext().getRequest();
		HttpServletResponse response = (HttpServletResponse) context.getExternalContext().getResponse();
		return get(request, response);
	}

	public String getApplication() {
		return application;
	}

	public void setApplication(String application) {
		this.application = application;
	}

	public boolean isApplication(String app) {
		if (StringUtils.isNotBlank(app) && StringUtils.isNotBlank(application)) {
			return application.equals(app);
		}
		return false;
	}

	public void sendObject(Object value) throws IOException {
		Gson gson = new Gson();
		String json = gson.toJson(value);
		response.setContentType("text/plain");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(json);
	}

	
	@Nullable public <T> T getObject(String name, Class<@NonNull T> type) {
		try {
			Gson gson = new Gson();
			return gson.fromJson(getString(name), type);
		} catch (JsonSyntaxException e) {
			return null;
		}
	}

	public List<WordModification> getObject(String name, Type type) {
		try {
			Gson gson = new Gson();
			return gson.fromJson(getString(name), type);
		} catch (JsonSyntaxException e) {
			return null;
		}
	}

	public boolean isLoggedIn() {
		return !isUser(SecurityService.PUBLIC_USERNAME);
	}

	public boolean isLocalRoot() {
		return getLocalPath().length==0;
	}

	@Path
	public void enrich() throws IOException, EndUserException {
		getLong("wordId");
		getObject("enrichment", Pair.class);
	}
	
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("URI: ").append(request.getRequestURI()).append("\n");
		
		Enumeration<String> parameterNames = request.getParameterNames();
		while (parameterNames.hasMoreElements()) {
			String name = parameterNames.nextElement();
			sb.append("\n").append(name).append(":").append(String.join(",", request.getParameterValues(name)));
		}
		return sb.toString();
	}

}
