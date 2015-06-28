package dk.in2isoft.onlineobjects.service.authentication;

import java.io.IOException;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.google.common.collect.Maps;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.service.authentication.perspectives.UserInfoPerspective;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.ScriptWriter;
import dk.in2isoft.onlineobjects.ui.StylesheetWriter;

public class AuthenticationController extends AuthenticationControllerBase {

	private static Logger log = Logger.getLogger(AuthenticationController.class);
	
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
	public void unknownRequest(Request request) throws IOException, EndUserException {
		request.redirect("/");
	}

	public void authenticate(Request request) throws IOException, EndUserException {
		String username = request.getString("username");
		String password = request.getString("password");
		String redirect = request.getString("redirect");
		boolean success = securityService.changeUser(request.getSession(), username, password);
		if (success) {
			if (Strings.isNotBlank(redirect)) {
				request.redirectFromBase(redirect);
			} else {
				request.redirect(".?action=loggedIn");
			}
		} else {
			log.warn("Authentication failed");
			request.redirect(".?action=invalidLogin&redirect="+redirect);
		}
	}
	

	public void changeUser(Request request) throws IOException, EndUserException {
		String username = request.getString("username");
		String password = request.getString("password");
		if (!StringUtils.isNotBlank(username)) {
			throw new IllegalRequestException("Username is blank","usernameIsBlank");
		}
		if (!StringUtils.isNotBlank(password)) {
			throw new IllegalRequestException("Password is blank","passwordIsBlank");
		}
		boolean success = securityService.changeUser(request.getSession(), username, password);
		Map<String,Object> response = Maps.newHashMap();
		response.put("success", success);
		request.sendObject(response);
	}
	

	public void recoverPassword(Request request) throws IOException, EndUserException {
		String usernameOrEmail = request.getString("usernameOrMail","No username or e-mail provided");
		if (passwordRecoveryService.sendRecoveryMail(usernameOrEmail, request.getSession())) {
			
		} else {
			throw new IllegalRequestException("Username or e-mail not found");
		}
	}
	

	public void getUserInfo(Request request) throws ModelException, IOException {
		User user = request.getSession().getUser();
		Image image = memberService.getUsersProfilePhoto(user);
		Person person = memberService.getUsersPerson(user);
		
		UserInfoPerspective info = new UserInfoPerspective();
		info.setUsername(user.getUsername());
		if (image!=null) {
			info.setPhotoId(image.getId());
		}
		if (person!=null) {
			info.setFullName(person.getFullName());
		} else {
			info.setFullName(user.getName());
		}
		request.sendObject(info);
	}
	

	public void logout(Request request) throws IOException, EndUserException {
		securityService.logOut(request.getSession());
		request.redirect(".?action=loggedOut");
	}
}
