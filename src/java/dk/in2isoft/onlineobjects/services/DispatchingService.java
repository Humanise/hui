package dk.in2isoft.onlineobjects.services;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.util.StopWatch;

import dk.in2isoft.commons.http.HeaderUtil;
import dk.in2isoft.commons.xml.XSLTUtil;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.modules.dispatch.Responder;
import dk.in2isoft.onlineobjects.ui.ErrorRenderer;
import dk.in2isoft.onlineobjects.ui.Request;

public class DispatchingService implements InitializingBean {

	private static Logger log = Logger.getLogger(DispatchingService.class);
	
	private ModelService modelService;
	private SecurityService securityService;
	private SurveillanceService surveillanceService;

	private List<Responder> responders;
	
	public DispatchingService() {
	}
	
	public void afterPropertiesSet() throws Exception {
	}
	
	public void setResponders(List<Responder> responders) {
		this.responders = responders;
	}
	
	public boolean doFilter(HttpServletRequest servletRequest, HttpServletResponse servletResponse, FilterChain chain) throws IOException, ServletException {
		//try {Thread.sleep(2000);} catch (InterruptedException e1) {}
		
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		boolean handled = false;
		Request request = Request.get(servletRequest, servletResponse);
		Boolean shouldCommit = null;		

		if (request.isSet("username") && request.isSet("password")) {
			securityService.changeUser(request.getSession(), request.getString("username"),request.getString("password"));
		}
		
		securityService.ensureUserSession(servletRequest.getSession());
		
		for (Responder responder : responders) {
			if (!handled && responder.applies(request)) {
				handled = true;
				try {
					shouldCommit = responder.dispatch(request, chain);
				} catch (EndUserException e) {
					surveillanceService.survey(e,request);
					DispatchingService.displayError(request, e);
				}
			}
		}

		if (shouldCommit!=null) {
			if (shouldCommit) {
				modelService.commit();
			} else {
				modelService.rollBack();				
			}
		}
		stopWatch.stop();
		surveillanceService.survey(request);
		return handled;
	}


	public static void pushFile(HttpServletResponse response, File file) throws IOException {

		HeaderUtil.setModified(file, response);
		HeaderUtil.setOneWeekCache(response);
		String mimeType = HeaderUtil.getMimeType(file);
		response.setContentLength((int) file.length());
		FileInputStream in = null;
		try {
			ServletOutputStream out = response.getOutputStream();
			if (mimeType != null) {
				response.setContentType(mimeType);
			}
			in = new FileInputStream(file);
			IOUtils.copy(in, out);
		} catch (FileNotFoundException e) {
			throw new IOException("File: " + file.getPath() + " not found!");
		} finally {
			IOUtils.closeQuietly(in);
		}
	}

	public static void displayError(Request request, Exception ex) {
		log.error(ex.toString(), ex);
		ex = findUserException(ex);
		ErrorRenderer renderer = new ErrorRenderer(ex);
		try {
			if (ex instanceof SecurityException) {
				request.getResponse().setStatus(HttpServletResponse.SC_FORBIDDEN);
			} else if (ex instanceof ContentNotFoundException) {
				request.getResponse().setStatus(HttpServletResponse.SC_NOT_FOUND);
			} else {
				request.getResponse().setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			}
			XSLTUtil.applyXSLT(renderer, request);
		} catch (EndUserException e) {
			log.error(e.toString(), e);
		} catch (IOException e) {
			log.error(e.toString(), e);
		}
	}
	
	private static Exception findUserException(Exception ex) {
		if (ex instanceof EndUserException) {
			return ex;
		}
		Throwable cause = ex.getCause();
		while (cause!=null) {
			if (cause instanceof EndUserException) {
				return (Exception) cause;
			}
			cause = cause.getCause();
		}
		return ex;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
		
	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
	
	public void setSurveillanceService(SurveillanceService surveillanceService) {
		this.surveillanceService = surveillanceService;
	}
}
