package dk.in2isoft.onlineobjects.modules.dispatch;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import javax.servlet.FilterChain;

import org.apache.commons.lang.ArrayUtils;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.service.ServiceController;
import dk.in2isoft.onlineobjects.ui.Request;

public class ServicesResponder implements Responder {

	private static final Class<?>[] args = { Request.class };
	
	public boolean applies(Request request) {
		String[] path = request.getFullPath();
		return path.length > 0 && path[0].equals("service");
	}
	
	public Boolean dispatch(Request request, FilterChain chain) throws IOException, EndUserException {

		String[] path = request.getFullPath();
		request.setLocalContext((String[]) ArrayUtils.subarray(path, 0, 2));
		ServiceController controller = getServiceController(request,path[1]);
		if (controller == null) {
			throw new ContentNotFoundException("No controller found!");
		}
		if (path.length > 2) {
			try {
				callService(controller, path[2], request);
			} catch (NoSuchMethodException e) {
				controller.unknownRequest(request);
			}
		} else {
			controller.unknownRequest(request);
		}
		return true;
	}
	
	private ServiceController getServiceController(Request request, String name) {
		WebApplicationContext context = WebApplicationContextUtils.getWebApplicationContext(request.getRequest().getSession().getServletContext());
		Object bean = context.getBean(name+"Controller");
		return (ServiceController) bean;
	}

	private void callService(ServiceController controller, String methodName, Request request) throws EndUserException,
			NoSuchMethodException {
		try {
			Method method = controller.getClass().getDeclaredMethod(methodName, args);
			method.invoke(controller, new Object[] { request });
		} catch (IllegalAccessException e) {
			throw new EndUserException(e);
		} catch (InvocationTargetException e) {
			throw new EndUserException(e);
		}
	}
}
