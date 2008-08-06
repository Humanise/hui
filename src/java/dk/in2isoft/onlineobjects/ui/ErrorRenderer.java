/**
 * 
 */
package dk.in2isoft.onlineobjects.ui;

import java.io.File;

import nu.xom.Element;
import dk.in2isoft.commons.util.StackTraceUtil;
import dk.in2isoft.onlineobjects.core.Core;

public class ErrorRenderer extends XSLTInterfaceAdapter {

	private Exception exception;

	public ErrorRenderer(Exception ex) {
		this.exception = ex;
	}

	@Override
	protected void buildContent(Element parent) {
		Element error = createPageNode(parent, "error");
		Element message = create("message", exception.getMessage());
		Element trace = create("stackTrace",StackTraceUtil.getStackTrace(exception));
		error.appendChild(message);
		error.appendChild(trace);
	}

	@Override
	public File getStylesheet() {
		StringBuilder filePath = new StringBuilder();
		filePath.append(Core.getInstance().getConfiguration().getBaseDir());
		String[] path = {"WEB-INF","core","xslt","error.xsl"};
		for (int i = 0; i < path.length; i++) {
			filePath.append(File.separator);
			filePath.append(path[i]);
		}
		return new File(filePath.toString());
	}

	
}
