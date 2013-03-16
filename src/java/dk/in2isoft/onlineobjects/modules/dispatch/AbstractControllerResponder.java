package dk.in2isoft.onlineobjects.modules.dispatch;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.StupidProgrammerException;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.DispatchingService;
import dk.in2isoft.onlineobjects.ui.AbstractController;
import dk.in2isoft.onlineobjects.ui.Request;

public class AbstractControllerResponder {

	private static final Class<?>[] args = { Request.class };
	protected ConfigurationService configurationService;

	public AbstractControllerResponder() {
		super();
	}

	protected boolean pushFile(String[] path, HttpServletResponse response) throws IOException {
		StringBuilder filePath = new StringBuilder();
		filePath.append(configurationService.getBasePath());
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
		if (file.exists() && !file.isDirectory()) {
			DispatchingService.pushFile(response, file);
			return true;
		}
		return false;
	}
	
	private boolean isRequestMethod(Method method) {
		Class<?>[] parameterTypes = method.getParameterTypes();
		return (parameterTypes.length==1 && parameterTypes[0].equals(Request.class));
	}
	
	private List<Method> getRequestMethods(AbstractController controller) {
		List<Method> requestMethods = Lists.newArrayList();
		Method[] methods = controller.getClass().getMethods();
		for (Method method : methods) {
			if (isRequestMethod(method)) {
				requestMethods.add(method);
			}
		}
		return requestMethods; 
	}
	
	protected boolean callController(AbstractController controller, String methodName, Request request) throws EndUserException, NoSuchMethodException, IOException {
		try {
			List<Method> methods = getRequestMethods(controller);
			for (Method method : methods) {
				Path annotation = method.getAnnotation(Path.class);
				if (annotation!=null) {
					if (Strings.isNotBlank(annotation.expression())) {
						if (request.getLocalPathAsString().matches(annotation.expression())) {
							invokeMothod(controller, request, method);
							return true;
						}
					}
					
					String[] start = annotation.start();
					if (start.length==0) {
						start = new String[] {method.getName()};
					}
					if (request.testLocalPathStart(start)) {
						invokeMothod(controller, request, method);
						return true;
					}
				}
			}
			for (Method method : methods) {
				if (method.getName().equals(methodName)) {
					method.invoke(controller, new Object[] { request });
					return true;
				}
			}
		} catch (IllegalAccessException e) {
			throw new EndUserException(e);
		} catch (InvocationTargetException e) {
			throw new EndUserException(e);
		}
		return false;
	}
	
	protected void invokeMothod(AbstractController controller, Request request, Method method) throws IOException, StupidProgrammerException, EndUserException {
		try {
			Object result = method.invoke(controller, new Object[] { request });
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
	
	public final void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}

}