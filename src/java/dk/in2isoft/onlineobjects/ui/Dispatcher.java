package dk.in2isoft.onlineobjects.ui;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

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

import com.oreilly.servlet.ServletUtils;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.apps.ApplicationManager;
import dk.in2isoft.onlineobjects.core.ConfigurationException;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.service.ServiceController;
import dk.in2isoft.onlineobjects.service.ServiceManager;

public class Dispatcher implements Filter {

	FilterConfig filterConfig;

	private static Logger log = Logger.getLogger(Dispatcher.class);

	static final Class<?>[] args = { Request.class };

	public Dispatcher() {

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
		Request req = new Request(request, response);
		String[] path = req.getPath();
		if (path[0].equals("XmlWebGui") || path[0].equals("In2iGui") || path[0].equals("dwr") || path[0].equals("public")) {
			chain.doFilter(sRequest, sResponse);
		} else if (path[0].equals("app") && path.length > 1) {
			
			ApplicationController controller = ApplicationManager.getInstance().getToolController(path[1]);
			try {
				if (controller == null) {
					throw new EndUserException("No controller found!");
				}
				if (path.length > 2) {
					try {
						callTool(controller, path[2], req);
					} catch (EndUserException e) {
						if (!pushFile(path, response)) {
							throw e;
						}
					}
				} else {
					controller.unknownRequest(req);
				}
			} catch (EndUserException e) {
				try {
					callTool(controller, "unknownRequest", req);
				} catch (EndUserException ex) {
					displayError(req, ex);
				}
			}
		} else if (path[0].equals("service") && path.length > 1) {
			ServiceController controller = ServiceManager.getInstance().getServiceController(path[1]);
			try {
				if (controller == null) {
					throw new EndUserException("No controller found!");
				}
				if (path.length > 2) {
					callService(controller, path[2], req);
				} else {
					controller.unknownRequest(req);
				}
			} catch (EndUserException e) {
				displayError(req, e);
			}
		} else {
			displayError(req, new EndUserException("Nothing to do: "+ArrayUtils.toString(path, "/")));
		}
		Core.getInstance().getModel().commit();
	}

	private void ensureSession(HttpServletRequest request)
	throws dk.in2isoft.onlineobjects.core.SecurityException {
		HttpSession session = request.getSession();
		if (session.getAttribute(UserSession.SESSION_ATTRIBUTE)==null) {
			session.setAttribute(UserSession.SESSION_ATTRIBUTE, new UserSession());
		}
	}
	
	private void callTool(ApplicationController controller, String methodName, Request request) throws EndUserException {
		try {
			Method method = controller.getClass().getDeclaredMethod(methodName, args);
			method.invoke(controller, new Object[] { request });
		} catch (NoSuchMethodException e) {
			throw new EndUserException(e);
		} catch (IllegalAccessException e) {
			throw new EndUserException(e);
		} catch (InvocationTargetException e) {
			throw new EndUserException(e.getCause());
		}
	}

	private void callService(ServiceController controller, String methodName, Request request) throws EndUserException {
		try {
			Method method = controller.getClass().getDeclaredMethod(methodName, args);
			method.invoke(controller, new Object[] { request });
		} catch (NoSuchMethodException e) {
			throw new EndUserException(e);
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

	private void displayError(Request request, EndUserException ex) {
		try {
			log.error(ex.getMessage(), ex);
			ErrorDisplayer gui = new ErrorDisplayer();
			gui.setEndUSerException(ex);
			gui.display(request);
		} catch (EndUserException e) {

		} catch (IOException e) {

		}
	}

	private boolean pushFile(String[] path, HttpServletResponse response) throws ConfigurationException {
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
		//log.info(file.getAbsolutePath());
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

	public void push(HttpServletResponse response, File file) throws FileNotFoundException, IOException {
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
		// if (contentType!=null && contentType.length()>0) {
		// response.setContentType(contentType);
		// }
		response.setContentLength((int) file.length());
		try {
			ServletOutputStream out = response.getOutputStream();
			ServletUtils.returnFile(file.getPath(), out);
		} catch (FileNotFoundException e) {
			try {
				response.getWriter().print("File: " + file.getPath() + " not found!");
			} catch (IOException ignore) {
			}
		} catch (IOException e) {
			try {
				response.getWriter().print("File: " + file.getPath() + " not found!");
			} catch (IOException ignore) {
			}
		}
	}
}
