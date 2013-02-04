package dk.in2isoft.onlineobjects.ui;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.StupidProgrammerException;
import dk.in2isoft.onlineobjects.services.ConfigurationService;

public class AbstractController {

	protected ConfigurationService configurationService;

	public void unknownRequest(Request request) throws IOException, EndUserException {
		Method[] methods = getClass().getDeclaredMethods();
		for (Method method : methods) {
			Path annotation = method.getAnnotation(Path.class);
			
			if (annotation!=null) {
				String[] start = annotation.start();
				if (start.length==0) {
					start = new String[] {method.getName()};
				}
				if (request.testLocalPathStart(start)) {
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
			}
		}
		throw new ContentNotFoundException(request.getLocalPathAsString());
	}

	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}
}
