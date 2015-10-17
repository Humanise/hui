package dk.in2isoft.onlineobjects.apps.account;

import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.exceptions.ExplodingClusterFuckException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.Request;


public class AccountController extends AccountControllerBase {
	
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
	
	@Path
	public String generateNewSecret(Request request) throws IllegalRequestException, SecurityException, ModelException, ExplodingClusterFuckException {
		User user = request.getSession().getUser();
		return securityService.generateNewSecret(user);
	}
	
	
}
