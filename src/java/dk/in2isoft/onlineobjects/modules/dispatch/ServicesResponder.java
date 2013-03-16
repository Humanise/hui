package dk.in2isoft.onlineobjects.modules.dispatch;

import java.io.IOException;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;

import org.apache.commons.lang.ArrayUtils;

import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.service.ServiceController;
import dk.in2isoft.onlineobjects.ui.Request;

public class ServicesResponder extends AbstractControllerResponder implements Responder {
	
	private List<ServiceController> serviceControllers;
	
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
		RequestDispatcher dispatcher = controller.getDispatcher(request);
		if (dispatcher != null) {
			request.getResponse().setContentType("text/html");
			request.getResponse().setCharacterEncoding("UTF-8");
			try {
				dispatcher.forward(request.getRequest(), request.getResponse());
			} catch (ServletException e) {
				throw new EndUserException(e);
			}
		} else {
			if (path.length > 2) {
				try {
					if (!callController(controller, path[2], request)) {
						String[] filePath = new String[] { "service", controller.getName() };
						if (!pushFile((String[]) ArrayUtils.addAll(filePath, path), request.getResponse())) {
							controller.unknownRequest(request);
						}
					}
				} catch (NoSuchMethodException e) {
				}
			} else {
				controller.unknownRequest(request);
			}
		}
		return true;
	}
	
	private ServiceController getServiceController(Request request, String name) {
		for (ServiceController controller : serviceControllers) {
			if (name.equals(controller.getName())) {
				return controller;
			}
		}
		return null;
	}
	
	public void setServiceControllers(List<ServiceController> serviceControllers) {
		this.serviceControllers = serviceControllers;
	}
}
