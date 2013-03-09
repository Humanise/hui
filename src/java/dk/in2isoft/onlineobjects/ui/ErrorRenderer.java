/**
 * 
 */
package dk.in2isoft.onlineobjects.ui;

import java.io.File;

import nu.xom.Element;
import dk.in2isoft.commons.util.StackTraceUtil;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.services.ConfigurationService;

public class ErrorRenderer extends XSLTInterfaceAdapter {

	private Exception exception;
	private ConfigurationService configurationService;
	private Request request;
	private Integer status;

	public ErrorRenderer(Exception ex, Request request, ConfigurationService configurationService) {
		this.exception = ex;
		this.configurationService = configurationService;
		this.request = request;
	}

	@Override
	protected void buildContent(Element parent) {
		Element error = createPageNode(parent, "error");
		Element message = create("message", exception.getMessage());
		if (exception instanceof EndUserException) {
			EndUserException userException = (EndUserException) exception;
			userException.getCode();
		}
		if (status!=null) {
			error.appendChild(create("status", status.toString()));
		}
		Element trace = create("stackTrace",StackTraceUtil.getStackTrace(exception));
		error.appendChild(message);
		error.appendChild(trace);
	}
	
	public void setStatus(Integer status) {
		this.status = status;
	}

	@Override
	public File getStylesheet() {
		StringBuilder filePath = new StringBuilder();
		filePath.append(configurationService.getBasePath());
		String[] path = {"WEB-INF","core","xslt","error.xsl"};
		for (int i = 0; i < path.length; i++) {
			filePath.append(File.separator);
			filePath.append(path[i]);
		}
		return new File(filePath.toString());
	}

	
}
