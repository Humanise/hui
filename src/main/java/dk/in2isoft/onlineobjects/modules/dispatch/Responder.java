package dk.in2isoft.onlineobjects.modules.dispatch;

import java.io.IOException;

import javax.servlet.FilterChain;

import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.ui.Request;

public interface Responder {

	public abstract boolean applies(Request request);

	public abstract Boolean dispatch(Request request, FilterChain chain) throws IOException, EndUserException;

}