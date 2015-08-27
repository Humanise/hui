package dk.in2isoft.onlineobjects.core;

import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.exceptions.ExplodingClusterFuckException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Item;
import dk.in2isoft.onlineobjects.model.Privilege;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.PasswordRecoveryService;
import dk.in2isoft.onlineobjects.services.SessionService;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.ValidationUtil;

public class SecurityService {
	
	private static final Logger log = Logger.getLogger(SecurityService.class);

	public static final String ADMIN_USERNAME = "admin";
	public static final String PUBLIC_USERNAME = "public";
	
	public static Set<String> RESERVED_USERNAMES = Sets.newHashSet(ADMIN_USERNAME,PUBLIC_USERNAME);
	
	private ModelService modelService;
	private ConfigurationService configurationService;
	private SessionService sessionService;
	private PasswordEncryptionService passwordEncryptionService;
	private PasswordRecoveryService passwordRecoveryService;

	private User publicUser;
	private Privileged adminPrivileged;

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
		User user = getUser(username, password);
		if (user!=null) {
			userSession.setUser(user);
			return true;
		}
		return false;
	}
	
	public User getUser(String username, String password) {
		User user = modelService.getUser(username);
		if (user==null) {
			return null;
		}
		if (Strings.isNotBlank(user.getSalt())) {
			if (passwordEncryptionService.authenticate(password, user.getPassword(), user.getSalt())) {
				return user;
			}
		}
		return null;
	}
	
	public void changePassword(String username, String existingPassword,String newPassword, Privileged privileged) throws SecurityException, ModelException, IllegalRequestException, ExplodingClusterFuckException {
		User user = getUser(username, existingPassword);
		if (user==null) {
			throw new IllegalRequestException("The user with username: "+username+" was not found");
		}
		if (!ValidationUtil.isValidPassword(newPassword)) {
			throw new IllegalRequestException("The new password is not valid");
		}
		changePassword(user, newPassword, privileged);
	}

	private void changePassword(User user, String password, Privileged privileged) throws ExplodingClusterFuckException, SecurityException, ModelException, IllegalRequestException {
		if (!ValidationUtil.isValidPassword(password)) {
			throw new IllegalRequestException("The password is not valid");
		}
		String salt = passwordEncryptionService.generateSalt();
		String encryptedPassword = passwordEncryptionService.getEncryptedPassword(password, salt);
		user.setPassword(encryptedPassword);
		user.setSalt(salt);
		user.removeProperties(User.PASSWORD_RECOVERY_CODE_PROPERTY);
		modelService.updateItem(user, privileged);
	}

	public void changePasswordUsingKey(String key, String password, UserSession session) throws ExplodingClusterFuckException, SecurityException, ModelException, IllegalRequestException {
		User user = passwordRecoveryService.getUserByRecoveryKey(key);
		if (user!=null) {
			changePassword(user, password, session);
			changeUser(session, user.getUsername(), password);
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

	public boolean isPublicView(Item item) {
		Privilege privilege = modelService.getPrivilege(item.getId(), getPublicUser().getId());
		if (privilege!=null) {
			return privilege.isView();
		}
		return false;
	}
	
	public Privilege getPrivilege(long id,Privileged priviledged) {
		return modelService.getPrivilege(id, priviledged.getIdentity());
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

	public Privileged getAdminPrivileged() {
		if (adminPrivileged==null) {
			User user = modelService.getUser(SecurityService.ADMIN_USERNAME);
			adminPrivileged = new DummyPrivileged(user.getId(), true);
		}
		return adminPrivileged;
	}

	public User getUserBySecret(String secret) {
		if (Strings.isBlank(secret)) {
			return null;
		}
		Query<User> query = Query.after(User.class).withCustomProperty(Property.KEY_AUTHENTICATION_SECRET, secret);
		// TODO Should this use a privileged?
		SearchResult<User> result = modelService.search(query);
		return result.getFirst();		
	}

	private User getInitialUser() {
		if (configurationService.isDevelopmentMode()) {
			String developmentUser = configurationService.getDevelopmentUser();
			if (Strings.isNotBlank(developmentUser)) {
				User user = modelService.getUser(developmentUser);
				if (user!=null) {
					return user;
				}
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

	public UserSession ensureUserSession(HttpSession session) {
		if (session.getAttribute(UserSession.SESSION_ATTRIBUTE) == null) {
			log.debug("Creating new user session");
			session.setAttribute(UserSession.SESSION_ATTRIBUTE, new UserSession(getInitialUser()));
		}
		return UserSession.get(session);
	}

	public boolean transferLogin(Request request, String sessionId) {
		Long userId = sessionService.getUserIdForSession(sessionId);
		if (userId==null) {
			log.error("User id not found");
			return false;
		}
		User admin = modelService.getUser(SecurityService.ADMIN_USERNAME);
		try {
			UserSession session = request.getSession();
			if (session!=null && session.getIdentity()!=userId) {
				User user = modelService.get(User.class, userId, admin);
				session.setUser(user);
				return true;
			}
		} catch (ModelException e) {
			log.error("Unable to change session",e);
		}
		return false;
	}

	public boolean canChangeUsername(User user) {
		return !SecurityService.RESERVED_USERNAMES.contains(user.getUsername());
	}

	public String generateNewSecret(User user) throws ModelException, SecurityException {
		User reloaded = modelService.get(User.class, user.getId(), user);
		if (reloaded!=null) {
			String secret = Strings.generateRandomString(50);
			reloaded.overrideFirstProperty(Property.KEY_AUTHENTICATION_SECRET, secret);
			modelService.updateItem(reloaded, user);
			return secret;
		}
		return null;
	}
	
	
	// Wiring...

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}
	
	public void setSessionService(SessionService sessionService) {
		this.sessionService = sessionService;
	}
	
	public void setPasswordEncryptionService(PasswordEncryptionService passwordEncryptionService) {
		this.passwordEncryptionService = passwordEncryptionService;
	}
	
	public void setPasswordRecoveryService(PasswordRecoveryService passwordRecoveryService) {
		this.passwordRecoveryService = passwordRecoveryService;
	}
}
