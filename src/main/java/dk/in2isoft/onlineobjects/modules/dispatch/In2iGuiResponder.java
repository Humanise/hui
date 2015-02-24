package dk.in2isoft.onlineobjects.modules.dispatch;

import java.io.File;
import java.io.IOException;

import javax.servlet.FilterChain;

import dk.in2isoft.commons.http.HeaderUtil;
import dk.in2isoft.in2igui.In2iGui;
import dk.in2isoft.onlineobjects.services.DispatchingService;
import dk.in2isoft.onlineobjects.ui.Request;

public class In2iGuiResponder implements Responder {

	//private static Logger log = Logger.getLogger(In2iGuiResponder.class);
	
	public boolean applies(Request request) {
		String[] path = request.getFullPath();
		return path.length > 0 && path[0].equals("hui");
	}
	
	public Boolean dispatch(Request request, FilterChain chain) throws IOException {

		String[] path = request.getFullPath();
		StringBuilder file = new StringBuilder();
		file.append(In2iGui.getInstance().getPath());
		for (int i = 1; i < path.length; i++) {
			file.append(File.separatorChar);
			file.append(path[i]);
		}
		File fileObj = new File(file.toString());
		if (fileObj.exists()) {
			DispatchingService.pushFile(request.getResponse(), fileObj);
		} else {
			HeaderUtil.setNotFound(request.getResponse());
		}
		return null;
	}
}
