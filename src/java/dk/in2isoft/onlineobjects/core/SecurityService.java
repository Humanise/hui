package dk.in2isoft.onlineobjects.core;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.model.Item;
import dk.in2isoft.onlineobjects.model.Privilege;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.services.ConfigurationService;

public class SecurityService {
	
	private static final Logger log = Logger.getLogger(SecurityService.class);

	public static final String ADMIN_USERNAME = "admin";
	public static final String PUBLIC_USERNAME = "public";
	
	private ModelService modelService;
	private User publicUser;
	private ConfigurationService configurationService;

	/**
	 * Tries to change the user of a session
	 * @param userSession The session to change user on
	 * @param username The username
	 * @param password The password
	 * @return True if user was changed
	 */
	public boolean changeUser(UserSession userSession, String username, String password) {
		if (userSession==null || username==null || password==null) {
			throw new IllegalArgumentException("session, username or password is null");
		}
		User user = modelService.getUser(username);
		if (user==null) {
			return false;
		} else if (password.equals(user.getPassword())) {
			userSession.setUser(user);
			return true;
		} else {
			return false;			
		}
	}
	
	public boolean logOut(UserSession userSession) {
		User user = modelService.getUser("public");
		if (user==null) {
			return false;
		} else {
			userSession.setUser(user);
			return true;
		}
	}
	
	public Privilege getPrivilege(long id,Privileged priviledged) {
		return modelService.getPriviledge(id, priviledged.getIdentity());
	}
	
	public List<Privileged> expand(Privileged priviledged) {
		List<Privileged> privs = Lists.newArrayList(priviledged);
		User publicUser = getPublicUser();
		if (priviledged.getIdentity()!=publicUser.getIdentity()) {
			privs.add(publicUser);
		}
		return privs;
	}
	
	public boolean canView(Item item,Privileged privileged) {
		if (privileged.isSuper()) {
			return true;
		}
		List<Privileged> expand = expand(privileged);
		for (Privileged priv : expand) {
			if (canExactlyView(item, priv)) {
				return true;
			}
		}
		return false;
	}
	
	public boolean canDelete(Item item,Privileged privileged) {
		if (item instanceof User) {
			User user = (User) item;
			if (SecurityService.ADMIN_USERNAME.equals(user.getUsername())) {
				return false;
			}
		}
		if (privileged.isSuper()) {
			return true;
		}
		List<Privileged> expand = expand(privileged);
		for (Privileged priv : expand) {
			if (canExactlyDelete(item, priv)) {
				return true;
			}
		}
		return false;
	}
	
	public boolean canModify(Item item,Privileged priviledged) {
		if (priviledged.isSuper()) {
			return true;
		}
		List<Privileged> expand = expand(priviledged);
		for (Privileged priv : expand) {
			if (canExactlyModify(item, priv)) {
				return true;
			}
		}
		return false;
	}
	
	private boolean canExactlyView(Item item, Privileged priviledged) {
		Privilege privilege = getPrivilege(item.getId(), priviledged);
		if (privilege==null) {
			return false;
		} else {
			return privilege.isView();
		}
	}
	
	private boolean canExactlyDelete(Item item, Privileged priviledged) {
		Privilege privilege = getPrivilege(item.getId(), priviledged);
		if (privilege==null) {
			return false;
		} else {
			return privilege.isDelete();
		}
	}
	
	private boolean canExactlyModify(Item item, Privileged priviledged) {
		Privilege privilege = getPrivilege(item.getId(), priviledged);
		if (privilege==null) {
			return false;
		} else {
			return privilege.isAlter();
		}
	}
	
	public User getPublicUser() {
		if (publicUser==null) {
			publicUser = modelService.getUser(SecurityService.PUBLIC_USERNAME);
		}
		return publicUser;
	}

	private User getInitialUser() {
		if (configurationService.isDevelopmentMode()) {
			User user = modelService.getUser(configurationService.getDevelopmentUser());
			if (user!=null) {
				return user;
			}
		}
		return getPublicUser();
	}

	public void makePublicVisible(Item item, Privileged priviledged) throws SecurityException, ModelException {
		if (!canModify(item, priviledged)) {
			throw new SecurityException("The user cannot make this public");
		}
		modelService.grantPrivileges(item, getPublicUser(), true, false, false);
	}
	
	public void makePublicHidden(Item item, Privileged priviledged) throws SecurityException {
		if (!canModify(item, priviledged)) {
			throw new SecurityException("The user cannot make this non public");
		}
		User publicUser = getPublicUser();
		modelService.removePriviledges(item, publicUser);
	}

	public void grantPublicPrivileges(Item item, boolean view, boolean alter, boolean delete) throws ModelException {
		modelService.grantPrivileges(item, getPublicUser(), view, alter, delete);		
	}

	public UserSession ensureUserSession(HttpSession session) throws SecurityException {
		if (session.getAttribute(UserSession.SESSION_ATTRIBUTE) == null) {
			log.debug("Creating new user session");
			session.setAttribute(UserSession.SESSION_ATTRIBUTE, new UserSession(getInitialUser()));
		}
		return UserSession.get(session);
	}


	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}
}
