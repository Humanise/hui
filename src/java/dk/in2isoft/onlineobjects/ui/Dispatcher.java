package dk.in2isoft.onlineobjects.ui;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.ArrayUtils;
import org.apache.log4j.Logger;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;
import com.google.common.collect.Multimap;
import com.google.common.collect.Multimaps;
import com.oreilly.servlet.ServletUtils;

import dk.in2isoft.commons.xml.XSLTUtil;
import dk.in2isoft.in2igui.In2iGui;
import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.model.Application;
import dk.in2isoft.onlineobjects.service.ServiceController;
import dk.in2isoft.onlineobjects.service.ServiceManager;

public class Dispatcher implements Filter {

	FilterConfig filterConfig;

	private static Logger log = Logger.getLogger(Dispatcher.class);

	private List<String> reserved = new ArrayList<String>();

	private boolean simulateDelay = false;

	static final Class<?>[] args = { Request.class };

	private final ImmutableMap<String, String> mimeTypes;

	private List<Application> apps = Lists.newArrayList();
	private Multimap<String, Pattern> mappings;

	public Dispatcher() {
		reserved.add("XmlWebGui");
		reserved.add("In2iGui");
		reserved.add("public");
		reserved.add("faces");
		mimeTypes = new ImmutableMap.Builder<String,String>()
			.put("html", "text/html")
			.put("htm", "text/html")
			.put("xhtml", "application/xhtml+xml")
			.put("js", "text/javascript")
			.put("css", "text/css")
			.put("png", "image/png")
			.put("gif", "image/gif")
			.put("jpg", "image/jpeg")
			.put("jpeg", "image/jpeg")
			.put("swf", "application/x-shockwave-flash")
			.build();
		{
			Application app = new Application();
			app.setName("setup");
			app.addProperty(Application.PROPERTY_URL_MAPPING, "http://setup\\.onlineobjects\\.com:9090.*");
			apps.add(app);
		}
		{
			Application app = new Application();
			app.setName("community");
			app.addProperty(Application.PROPERTY_URL_MAPPING, "http://[a-z0-9_\\.]*jojo\\.dk:9090.*");
			app.addProperty(Application.PROPERTY_URL_MAPPING, ".*");
			apps.add(app);
		}
		
		mappings = Multimaps.newLinkedHashMultimap();
		
		for (Application app : apps) {
			for (String reg : app.getPropertyValues(Application.PROPERTY_URL_MAPPING)) {
				Pattern p  = Pattern.compile(reg);
				mappings.put("community", p);
			}
		}
	}
	
	private void fixCookieScope(Request request) {
		String baseDomain = request.getBaseDomain();
		if (baseDomain!=null) {
			request.getResponse().setHeader("Set-Cookie", "JSESSIONID="+request.getRequest().getSession().getId()+";domain=."+baseDomain);
		}
	}
	
	public void doFilter(ServletRequest sRequest, ServletResponse sResponse, FilterChain chain) throws IOException,
			ServletException {
		HttpServletRequest request = (HttpServletRequest) sRequest;
		HttpServletResponse response = (HttpServletResponse) sResponse;
		try {
			ensureSession(request);
		} catch (SecurityException e) {
			throw new ServletException(e);
		}
		boolean shouldCommit = false;
		Request req = new Request(request, response);
		fixCookieScope(req);
		if (req.isSet("username") && req.isSet("password")) {
			Core.getInstance().getSecurity().changeUser(req.getSession(), req.getString("username"),
					req.getString("password"));
		}
		String[] path = req.getFullPath();
		if (path.length > 0 && (path[0].equals("dwr") || path[0].equals("webdav"))) {
			if (simulateDelay) {
				delay(path.toString());
			}
			chain.doFilter(sRequest, sResponse);
			shouldCommit = true;
		} else if (path.length > 0 && path[0].equals("core")) {
			String[] filePath = new String[] { "core", "web" };
			if (!pushCoreFile((String[]) ArrayUtils.addAll(filePath, ArrayUtils.subarray(path, 1, path.length)),
					response)) {
				displayError(req, new EndUserException("Not found"));
			}

		} else if (path.length > 0 && path[0].equals("In2iGui")) {
			StringBuilder file = new StringBuilder();
			file.append(In2iGui.getInstance().getPath());
			for (int i = 1; i < path.length; i++) {
				file.append(File.separatorChar);
				file.append(path[i]);
			}
			File fileObj = new File(file.toString());
			if (fileObj.exists()) {
				push(response, fileObj);
			} else {
				response.sendError(HttpServletResponse.SC_NOT_FOUND);
			}
			// chain.doFilter(sRequest, sResponse);
		} else if (path.length > 0 && reserved.contains(path[0])) {
			chain.doFilter(sRequest, sResponse);
		} else if (path.length > 1 && path[0].equals("app")) {
			req.setLocalContext((String[]) ArrayUtils.subarray(path, 0, 2));
			callApplication(path[1], req);
			shouldCommit = true;
		} else if (path.length > 1 && path[0].equals("service")) {
			req.setLocalContext((String[]) ArrayUtils.subarray(path, 0, 2));
			ServiceController controller = ServiceManager.getInstance().getServiceController(path[1]);
			try {
				if (controller == null) {
					throw new EndUserException("No controller found!");
				}
				if (path.length > 2) {
					try {
						callService(controller, path[2], req);
					} catch (NoSuchMethodException e) {
						controller.unknownRequest(req);
					}
				} else {
					controller.unknownRequest(req);
				}
			} catch (EndUserException e) {
				displayError(req, e);
			}
			shouldCommit = true;
		} else {
			String appName = resolveMapping(req);
			log.debug(appName);
			if (appName == null) {
				displayError(req, new EndUserException("Not found"));
			} else {
				callApplication(appName, req);
				shouldCommit = true;
			}
		}
		if (shouldCommit) {
			Core.getInstance().getModel().commit();
		}
	}
	
	private String resolveMapping(Request request) {
		String url = request.getRequest().getRequestURL().toString();
		for (Entry<String, Pattern> mapping : mappings.entries()) {
			Pattern pattern = mapping.getValue();
			Matcher matcher = pattern.matcher(url);
			if (matcher.matches()) {
				return mapping.getKey();
			}
		}
		return null;
	}

	private void ensureSession(HttpServletRequest request) throws dk.in2isoft.onlineobjects.core.SecurityException {
		// log.info("Session valid: "+request.isRequestedSessionIdValid());
		HttpSession session = request.getSession();
		if (session.getAttribute(UserSession.SESSION_ATTRIBUTE) == null) {
			session.setAttribute(UserSession.SESSION_ATTRIBUTE, new UserSession());
		}
	}

	private void callApplication(String application, Request request) throws IOException {
		ApplicationController controller = Core.getInstance().getApplicationManager().getController(application);
		String[] path = request.getLocalPath();
		try {
			if (controller == null) {
				throw new EndUserException("No controller found!");
			}
			if (path.length > 0) {
				try {
					boolean called = callApplicationMethod(controller, path[0], request);
					if (!called) {
						String[] filePath = new String[] { "app", application };
						if (!pushFile((String[]) ArrayUtils.addAll(filePath, path), request.getResponse())) {
							controller.unknownRequest(request);
						}
					}
				} catch (InvocationTargetException e) {
					displayError(request, e);
				}
			} else {
				controller.unknownRequest(request);
			}
		} catch (EndUserException e) {
			displayError(request, e);
		}
	}

	private boolean callApplicationMethod(ApplicationController controller, String methodName, Request request)
			throws EndUserException, InvocationTargetException {
		try {
			Method method = controller.getClass().getDeclaredMethod(methodName, args);
			boolean accessible = method.isAccessible();
			if (!accessible) return false;
			method.invoke(controller, new Object[] { request });
			return true;
		} catch (IllegalAccessException e) {
			return false;
		} catch (NoSuchMethodException e) {
			return false;
		}
	}

	private void callService(ServiceController controller, String methodName, Request request) throws EndUserException, NoSuchMethodException {
		try {
			Method method = controller.getClass().getDeclaredMethod(methodName, args);
			method.invoke(controller, new Object[] { request });
		} catch (IllegalAccessException e) {
			throw new EndUserException(e);
		} catch (InvocationTargetException e) {
			throw new EndUserException(e);
		}
	}

	public void destroy() {
	}

	public void init(FilterConfig filterConfig) {

		this.filterConfig = filterConfig;
	}

	private void displayError(Request request, Exception ex) {
		log.error(ex.toString(), ex);
		ErrorRenderer renderer = new ErrorRenderer(ex);
		try {
			request.getResponse().setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			XSLTUtil.applyXSLT(renderer, request);
		} catch (EndUserException e) {
			log.error(e.toString(), e);
		} catch (IOException e) {
			log.error(e.toString(), e);
		}
	}

	private boolean pushCoreFile(String[] path, HttpServletResponse response) {
		boolean success = false;
		StringBuilder filePath = new StringBuilder();
		filePath.append(Core.getInstance().getConfiguration().getBaseDir());
		filePath.append(File.separator);
		filePath.append("WEB-INF");
		for (int i = 0; i < path.length; i++) {
			filePath.append(File.separator);
			filePath.append(path[i]);
		}
		File file = new File(filePath.toString());
		// log.info(file.getAbsolutePath());
		if (file.exists()) {
			try {
				push(response, file);
				success = true;
			} catch (Exception e) {
				log.error(e.toString(), e);
			}
		}
		return success;
	}

	private boolean pushFile(String[] path, HttpServletResponse response) {
		boolean success = false;
		StringBuilder filePath = new StringBuilder();
		filePath.append(Core.getInstance().getConfiguration().getBaseDir());
		filePath.append(File.separator);
		filePath.append("WEB-INF");
		filePath.append(File.separator);
		filePath.append("apps");
		filePath.append(File.separator);
		filePath.append(path[1]);
		filePath.append(File.separator);
		filePath.append("web");
		for (int i = 2; i < path.length; i++) {
			filePath.append(File.separator);
			filePath.append(path[i]);
		}
		File file = new File(filePath.toString());
		// log.info(file.getAbsolutePath());
		if (file.exists() && !file.isDirectory()) {
			try {
				push(response, file);
				success = true;
			} catch (Exception e) {
				log.error(e.toString(), e);
			}
		}
		return success;
	}

	public void push(HttpServletResponse response, File file) throws IOException {

		if (!true) {
			// Set to expire far in the past.
			response.setHeader("Expires", "Sat, 6 May 1995 12:00:00 GMT");
			// Set standard HTTP/1.1 no-cache headers.
			response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
			// Set IE extended HTTP/1.1 no-cache headers (use addHeader).
			response.addHeader("Cache-Control", "post-check=0, pre-check=0");
			// Set standard HTTP/1.0 no-cache header.
			response.setHeader("Pragma", "no-cache");
		} else {
			response.setDateHeader("Last-Modified", file.lastModified());
		}
		String mimeType = getMimeType(file);
		response.setContentLength((int) file.length());
		try {
			ServletOutputStream out = response.getOutputStream();
			if (mimeType != null) {
				response.setContentType(mimeType);
			}
			ServletUtils.returnFile(file.getPath(), out);
		} catch (FileNotFoundException e) {
			throw new IOException("File: " + file.getPath() + " not found!");
		}
	}

	private String getMimeType(File file) {
		String name = file.getName();
		int pos = name.lastIndexOf(".");
		if (pos != -1) {
			String ext = name.substring(pos + 1);
			return mimeTypes.get(ext);
		} else {
			return null;
		}
	}

	private void delay(String path) {
		// long delay:
		try {
			log.info("Waiting before serving of:" + path);
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			log.debug("ignored exception", e);
		}
	}
}
