package dk.in2isoft.onlineobjects.modules.dispatch;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;

import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.ui.Request;

public class DWRResponder implements Responder {

	public boolean applies(Request request) {
		String[] path = request.getFullPath();
		return path.length > 0 && path[0].equals("dwr");
	}
	
	public Boolean dispatch(Request request, FilterChain chain) throws IOException, EndUserException {
		try {
			chain.doFilter(request.getRequest(), request.getResponse());
		} catch (ServletException e) {
			throw new EndUserException(e);
		}
		
		Object dwrx = request.getRequest().getAttribute("dwr-exception");
		if (Boolean.TRUE.equals(dwrx)) {
			return false;
		}
		return true;
	}
}
