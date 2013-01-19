package dk.in2isoft.onlineobjects.services;

import java.util.Collection;
import java.util.Collections;
import java.util.SortedSet;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.apache.commons.lang.exception.ExceptionUtils;

import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.modules.surveillance.RequestInfo;
import dk.in2isoft.onlineobjects.modules.surveillance.RequestList;
import dk.in2isoft.onlineobjects.ui.Request;

public class SurveillanceService {
	
	private RequestList longestRunningRequests;
	private ConcurrentLinkedQueue<String> exceptions;


	public SurveillanceService() {
		this.longestRunningRequests = new RequestList();
		exceptions = new ConcurrentLinkedQueue<String>();
	}
	
	public void survey(Request request) {
		if (!request.getRequest().getRequestURI().startsWith("/service/image")) {
			this.longestRunningRequests.register(request);
		}
	}
	
	public void survey(Exception e, Request request) {
		Throwable known = getKnownException(e);
		String trace = ExceptionUtils.getFullStackTrace(known);
		trace = request.getRequest().getRequestURI()+"\n"+trace;
		exceptions.add(trace);
		if (exceptions.size()>60) {
			exceptions.poll();
		}
	}
	
	private Throwable getKnownException(Throwable root) {
		Throwable cause = root;
		while (cause!=null) {
			if (cause instanceof EndUserException) {
				return cause;
			}
			cause = cause.getCause();
		}
		
		return root;
	}
	
	public SortedSet<RequestInfo> getLongestRunningRequests() {
		return Collections.synchronizedSortedSet(longestRunningRequests.getSet());
	}
	
	public Collection<String> getLatestExceptions() {
		return exceptions;
	}
}
