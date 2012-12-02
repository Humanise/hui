package dk.in2isoft.onlineobjects.modules.dispatch;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;

import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.ui.Request;

public class FacesResponder implements Responder {

	public boolean applies(Request request) {
		String localPathAsString = request.getRequest().getRequestURI();
		return localPathAsString.indexOf("javax.faces.resource") != -1;
	}
	
	public Boolean dispatch(Request request, FilterChain chain) throws IOException, EndUserException {
		String localPath = request.getRequest().getRequestURI();
		int index = localPath.indexOf("javax.faces.resource");
		if (index==-1) {
			//index = localPath.indexOf("jsf");
		}
		if (index==-1) {
			index=0;
		}
		String substring = "/faces/"+localPath.substring(index);
		// log.debug("/faces/"+substring);
		RequestDispatcher requestDispatcher = request.getRequest().getRequestDispatcher(substring);
		try {
			requestDispatcher.forward(request.getRequest(), request.getResponse());
		} catch (ServletException e) {
			throw new EndUserException(e);
		}
		return true;
	}
}
