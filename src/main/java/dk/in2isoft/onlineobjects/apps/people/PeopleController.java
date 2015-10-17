package dk.in2isoft.onlineobjects.apps.people;

import java.io.IOException;

import dk.in2isoft.onlineobjects.apps.community.ProfileImageImporter;
import dk.in2isoft.onlineobjects.apps.community.UserProfileInfo;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.modules.images.ImageImporter;
import dk.in2isoft.onlineobjects.modules.importing.DataImporter;
import dk.in2isoft.onlineobjects.ui.Request;


public class PeopleController extends PeopleControllerBase {
	

	@Path
	public UserProfileInfo getUserProfile(Request request) throws EndUserException {
		Long userId = request.getLong("userId");
		User user = modelService.get(User.class, userId, request.getSession());
		if (user==null) {
			throw new EndUserException("The user was not found");
		}
		Person person = modelService.getChild(user, Person.class);
		if (person==null) {
			throw new EndUserException("The user does not have a person!");
		}
		return communityDAO.build(person,request.getSession());
	}

	@Path
	public void updateUserProfile(Request request) throws EndUserException {
		UserProfileInfo info = request.getObject("info", UserProfileInfo.class);
		User user = modelService.get(User.class, info.getUserId(), request.getSession());
		if (user==null) {
			throw new EndUserException("The user was not found");
		}
		Person person = modelService.getChild(user, Person.class);
		if (person==null) {
			throw new EndUserException("The user does not have a person!");
		}
		communityDAO.save(info, person, request.getSession());
	}

	@Path
	public void uploadProfileImage(Request request) throws EndUserException, IOException {
		DataImporter dataImporter = importService.createImporter();
		ImageImporter listener = new ProfileImageImporter(modelService,imageService,securityService);
		dataImporter.setListener(listener);
		dataImporter.importMultipart(this, request);
	}
}
