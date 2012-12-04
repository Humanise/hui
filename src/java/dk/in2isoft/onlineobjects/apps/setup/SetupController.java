package dk.in2isoft.onlineobjects.apps.setup;

import java.io.IOException;

import dk.in2isoft.in2igui.data.ListWriter;
import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.apps.setup.perspectives.UserPerspective;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Privilege;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.Request;

public class SetupController extends ApplicationController {

	private SecurityService securityService;
	
	public SetupController() {
		super("setup");
	}

	@Override
	public void unknownRequest(Request request)
	throws IOException,EndUserException {
		if (!request.isUser(SecurityService.ADMIN_USERNAME)) {
			request.redirectFromBase("/service/authentication/?redirect=/app/setup/&action=appAccessDenied&faultyuser="+request.getSession().getUser().getUsername());
		} else {
			String path = request.getLocalPathAsString();
			if (path.endsWith("gui") || path.endsWith("/")) {
				showGui(request);
			} else {
				super.unknownRequest(request);
			}
		}
	}
	
	@Path(start="listUsers")
	public void listUsers(Request request) throws IOException,EndUserException {
		User publicUser = securityService.getPublicUser();
		int page = request.getInt("page");
		Query<User> query = Query.of(User.class).withWords(request.getString("search")).withPaging(page, 10);
		SearchResult<User> result = modelService.search(query);

		ListWriter writer = new ListWriter(request);
		
		writer.startList();
		writer.window(result.getTotalCount(), 10, page);
		writer.startHeaders();
		writer.header("Name");
		writer.header("Username");
		writer.header("Person");
		writer.header("E-mail");
		writer.header("Image");
		writer.header("Images");
		writer.header("Public permissions");
		writer.endHeaders();
		for (User user : result.getList()) {
			Query<Image> imgQuery = Query.after(Image.class).withPrivileged(user);
			Long imageCount = modelService.count(imgQuery);
			Image image = modelService.getChild(user, Image.class);
			Person person = modelService.getChild(user, Person.class);
			EmailAddress email = null;
			if (person!=null) {
				email = modelService.getChild(person, EmailAddress.class);
			}
			writer.startRow().withId(user.getId()).withKind("user");
			writer.startCell().withIcon(user.getIcon()).text(user.getName()).endCell();
			writer.startCell().text(user.getUsername()).endCell();
			writer.startCell();
			if (person!=null) {
				writer.withIcon(person.getIcon()).text(person.getFullName());
			}
			writer.endCell();
			writer.startCell();
			if (email!=null) {
				writer.withIcon(email.getIcon());
				writer.text(email.getAddress());
			}
			writer.endCell();
			writer.startCell();
			if (image!=null) {
				writer.withIcon(image.getIcon());
				writer.text(image.getName());
			}
			writer.endCell();
			writer.startCell().text(imageCount).endCell();
			writer.startCell();
			if (securityService.canView(user, publicUser)) {
				writer.icon("monochrome/view");
			}
			if (securityService.canModify(user, publicUser)) {
				writer.icon("monochrome/edit");
			}
			if (securityService.canDelete(user, publicUser)) {
				writer.icon("monochrome/delete");
			}
			writer.endCell();
			writer.endRow();
		}
		writer.endList();
	}
	
	
	@Path(start="listUsersObjects")
	public void listUsersObjects(Request request) throws IOException,EndUserException {
		long id = request.getLong("userId");
		int page = request.getInt("page");
		
		User publicUser = securityService.getPublicUser();
		User user = modelService.get(User.class, id, request.getSession());
		if (user==null) {
			return;
		}
		Query<Entity> query = Query.of(Entity.class).withPrivileged(user).withPaging(page, 30);
		SearchResult<Entity> result = modelService.search(query);

		ListWriter writer = new ListWriter(request);
		
		writer.startList();
		writer.window(result.getTotalCount(), 30, page);
		writer.startHeaders();
		writer.header("Name",40);
		writer.header("Type");
		writer.header("Private grants",1);
		writer.header("Public grants",1);
		writer.endHeaders();
		for (Entity entity : result.getList()) {
			Privilege privilege = securityService.getPrivilege(entity.getId(), user);
			Privilege publicPrivilege = securityService.getPrivilege(entity.getId(), publicUser);
			writer.startRow();
			writer.startCell().withIcon(entity.getIcon()).text(entity.getName()).endCell();
			writer.startCell().text(entity.getClass().getSimpleName()).endCell();
			writer.startCell().nowrap();
			if (privilege.isView()) {
				writer.icon("monochrome/view");
			}
			if (privilege.isAlter()) {
				writer.icon("monochrome/edit");
			}
			if (privilege.isDelete()) {
				writer.icon("monochrome/delete");
			}			
			writer.endCell();
			writer.startCell().nowrap();
			if (publicPrivilege!=null) {
				if (publicPrivilege.isView()) {
					writer.icon("monochrome/view");
				}
				if (publicPrivilege.isAlter()) {
					writer.icon("monochrome/edit");
				}
				if (publicPrivilege.isDelete()) {
					writer.icon("monochrome/delete");
				}
			}
			writer.endCell();
			writer.endRow();
		}
		writer.endList();
	}
	
	@Path(start="loadUser")
	public void loadUser(Request request) throws IOException,EndUserException {
		Long id = request.getLong("id");
		User user = modelService.get(User.class, id, request.getSession());
		if (user==null) {
			throw new ContentNotFoundException("User not found (id="+id+")");
		}
		User publicUser = securityService.getPublicUser();
		UserPerspective perspective = new UserPerspective();
		perspective.setUsername(user.getUsername());
		perspective.setName(user.getName());
		perspective.setPublicView(securityService.canView(user, publicUser));
		perspective.setPublicModify(securityService.canModify(user, publicUser));
		perspective.setPublicDelete(securityService.canDelete(user, publicUser));
		request.sendObject(perspective);
	}
	
	@Path(start="saveUser")
	public void saveUser(Request request) throws IOException,EndUserException {
		UserPerspective perspective = request.getObject("user", UserPerspective.class);
		if (perspective==null) {
			throw new IllegalRequestException("No user provider");
		}
		User user = modelService.get(User.class, perspective.getId(), request.getSession());
		if (user==null) {
			throw new ContentNotFoundException("User not found (id="+perspective.getId()+")");
		}
		user.setUsername(perspective.getUsername());
		user.setName(perspective.getName());
		modelService.updateItem(user, request.getSession());
		
		securityService.grantPublicPrivileges(user, perspective.isPublicView(), perspective.isPublicModify(), perspective.isPublicDelete());
	}
	
	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
}
