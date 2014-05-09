package dk.in2isoft.onlineobjects.apps.account;

import java.io.IOException;

import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.ExplodingClusterFuckException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.ScriptWriter;
import dk.in2isoft.onlineobjects.ui.StylesheetWriter;


public class AccountController extends AccountControllerBase {

	@Path(expression="/script.[0-9]+.js")
	public void script(Request request) throws IOException, EndUserException {
		ScriptWriter writer = new ScriptWriter(request, configurationService);
		writer.write(publicScript);
	}

	@Path(expression="/style.[0-9]+.css")
	public void style(Request request) throws IOException, EndUserException {
		StylesheetWriter writer = new StylesheetWriter(request, configurationService);
		writer.write(publicStyle);
	}
	
	@Override
	public boolean isAllowed(Request request) {
		return true;
	}
	
	@Path
	public void changePassword(Request request) throws IllegalRequestException, SecurityException, ModelException, ExplodingClusterFuckException {
		String username = request.getSession().getUser().getUsername();
		String currentPassword = request.getString("currentPassword", "Current password must be provided");
		String newPassword = request.getString("newPassword", "New password must be provided");
		securityService.changePassword(username, currentPassword, newPassword, request.getSession());
	}
	
	@Path
	public void changePasswordUsingKey(Request request) throws IllegalRequestException, SecurityException, ModelException, ExplodingClusterFuckException {
		String key = request.getString("key", "Key must be provided");
		String password = request.getString("password", "Password must be provided");
		securityService.changePasswordUsingKey(key, password, request.getSession());
	}
	
	
}
