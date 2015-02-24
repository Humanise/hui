package dk.in2isoft.onlineobjects.ui;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Pattern;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.util.RestUtil;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.StupidProgrammerException;
import dk.in2isoft.onlineobjects.services.ConfigurationService;

public abstract class AbstractController {

	protected ConfigurationService configurationService;
	protected Map<Pattern,String> jsfMatchers = new LinkedHashMap<Pattern, String>();

	private String name;

	public AbstractController(String name) {
		this.name = name;
	}

	public final String getName() {
		return name;
	}

	protected void addJsfMatcher(String pattern,String path) {
		jsfMatchers.put(RestUtil.compile(pattern), "/jsf/"+getName()+"/"+path);
	}

	public void unknownRequest(Request request) throws IOException, EndUserException {
		Method[] methods = getClass().getDeclaredMethods();
		for (Method method : methods) {
			Path annotation = method.getAnnotation(Path.class);
			
			if (annotation!=null) {
				if (Strings.isNotBlank(annotation.expression())) {
					if (request.getLocalPathAsString().matches(annotation.expression())) {
						invokeMothod(request, method);
						return;
					}
				}
				
				String[] start = annotation.start();
				if (start.length==0) {
					start = new String[] {method.getName()};
				}
				if (request.testLocalPathStart(start)) {
					invokeMothod(request, method);
					return;
				}
			}
		}
		throw new ContentNotFoundException("The content could not be found");
	}

	public RequestDispatcher getDispatcher(Request request) {
		ServletContext context = request.getRequest().getSession().getServletContext();
		String localPath = request.getLocalPathAsString();
		String jsfPath = null;
		for (Map.Entry<Pattern, String> entry : jsfMatchers.entrySet()) {
			if (entry.getKey().matcher(localPath).matches()) {
				jsfPath = entry.getValue();
				break;
			}
		}
		if (jsfPath==null) {
			StringBuilder filePath = new StringBuilder();
			filePath.append(File.separator).append("jsf");
			filePath.append(File.separator).append(name);
			String[] path = request.getLocalPath();
			for (String item : path) {
				filePath.append(File.separator).append(item);
			}
			jsfPath = filePath.toString().replaceAll("\\.html", ".xhtml");
		}
		File file = new File(configurationService.getBasePath() + jsfPath);
		if (file.exists() && file.isFile()) {
			return context.getRequestDispatcher("/faces"+jsfPath);
		}
		return null;
	}

	private void invokeMothod(Request request, Method method) throws IOException, StupidProgrammerException, EndUserException {
		try {
			Object result = method.invoke(this, new Object[] { request });
			Class<?> returnType = method.getReturnType();
			if (!returnType.equals(Void.TYPE)) {
				request.sendObject(result);
			}
			return;
		} catch (IllegalArgumentException e) {
			throw new StupidProgrammerException(e);
		} catch (IllegalAccessException e) {
			throw new EndUserException(e);
		} catch (InvocationTargetException e) {
			Throwable cause = e.getCause();
			if (cause!=null) {
				throw new EndUserException(cause);
			} else {
				throw new EndUserException(e);
			}
		}
	}
	
	public final File getFile(String... path) {
		StringBuilder filePath = new StringBuilder();
		filePath.append(configurationService.getBasePath());
		filePath.append(File.separator);
		filePath.append("WEB-INF");
		filePath.append(File.separator);
		filePath.append(getDimension());
		filePath.append(File.separator);
		filePath.append(getName());
		for (int i = 0; i < path.length; i++) {
			filePath.append(File.separator);
			filePath.append(path[i]);
		}
		return new File(filePath.toString());
	}


	protected abstract String getDimension();

	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}
	
	public boolean logAccessExceptions() {
		return true;
	}
}
