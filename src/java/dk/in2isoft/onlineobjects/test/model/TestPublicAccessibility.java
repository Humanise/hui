package dk.in2isoft.onlineobjects.test.model;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Comment;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestPublicAccessibility extends AbstractSpringTestCase {

	@Autowired
	private SecurityService securityService;
	
	@Test
	public void testGrantUsingUnsavedObjects() throws EndUserException {
		User user = new User();
		Comment comment = new Comment();
		boolean caught = false;
		try {
			modelService.grantFullPrivileges(comment, user);
		} catch (ModelException e) {
			// Should throw exception because the user is not persistent
			caught = true;
		}
		assertTrue(caught);

		modelService.createItem(user, getPublicUser());
		
		caught = false;
		try {
			modelService.grantFullPrivileges(comment, user);
		} catch (ModelException e) {
			// Should throw exception because the comment is not persistent
			caught = true;
		}
		assertTrue(caught);
		
		modelService.commit();
	}
	
	@Test
	public void testPublicAccess() throws EndUserException {
		User publicUser = securityService.getPublicUser();
		User user = new User();
		
		modelService.createItem(user, publicUser);
		
		assertTrue(securityService.canView(user, publicUser));
		assertTrue(securityService.canDelete(user, publicUser));
		assertTrue(securityService.canModify(user, publicUser));

		// Test that user can access if "public" has access 
		assertTrue(securityService.canDelete(user, user));
		assertTrue(securityService.canModify(user, user));
		assertTrue(securityService.canView(user, user));
		
		modelService.removePriviledges(user, publicUser);

		assertFalse(securityService.canView(user, publicUser));
		assertFalse(securityService.canDelete(user, publicUser));
		assertFalse(securityService.canModify(user, publicUser));
		
		assertFalse(securityService.canDelete(user, user));
		assertFalse(securityService.canModify(user, user));
		assertFalse(securityService.canView(user, user));
		
		tryDeleteAndFail(user,publicUser);
		
		modelService.grantFullPrivileges(user, user);
		
		assertTrue(securityService.canDelete(user, user));
		assertTrue(securityService.canModify(user, user));
		assertTrue(securityService.canView(user, user));
		
		modelService.deleteEntity(user, user);

		boolean caught = false;
		try {
			modelService.createItem(user, publicUser);
		} catch (ModelException e) {
			// Catch exception when trying to re-create user
			caught = true;
		}
		assertTrue(caught);
		
		modelService.commit();
	}

	@Test
	public void testPublicDelete() throws EndUserException {

		User publicUser = securityService.getPublicUser();
		User user = new User();
		
		modelService.createItem(user, publicUser);
		
		assertTrue(securityService.canDelete(user, publicUser));
		assertTrue(securityService.canDelete(user, user));
		
		modelService.deleteEntity(user, user);
		
		modelService.commit();
	}

	@Test
	public void testPublicDelete2() throws EndUserException {

		User publicUser = securityService.getPublicUser();
		User user = new User();
		
		modelService.createItem(user, publicUser);
		modelService.removePriviledges(user, publicUser);
		assertFalse(securityService.canDelete(user, publicUser));

		// Test that user can access if "public" has access 
		assertFalse(securityService.canDelete(user, user));
		
		tryDeleteAndFail(user,user);
		
		securityService.grantPublicPrivileges(user, false, false, true);
		
		modelService.deleteEntity(user, user);
		
		modelService.commit();
	}

	@Test
	public void testPublicDeleteComment() throws EndUserException {

		User publicUser = securityService.getPublicUser();
		User user = new User();
		Comment comment = new Comment();
		
		modelService.createItem(user, publicUser);
		modelService.createItem(comment, publicUser);
		
		// The user can delete the comment since public can delete it
		assertTrue(securityService.canDelete(comment, user));
		
		modelService.removePriviledges(comment, publicUser);
		
		// The user can not delete the comment since public can not
		assertFalse(securityService.canDelete(comment, user));
		
		// Test that the user cannot delete the comment
		tryDeleteAndFail(comment, user);
		
		securityService.grantPublicPrivileges(comment, false, false, true);

		// Now the user can delete again
		assertTrue(securityService.canDelete(comment, user));

		modelService.deleteEntity(comment, user);
		modelService.deleteEntity(user, user);
		
		checkNotPersistent(user, publicUser);
		checkNotPersistent(comment, publicUser);
		
		modelService.commit();

		checkNotPersistent(user, publicUser);
		checkNotPersistent(comment, publicUser);
	}
	
	private void checkNotPersistent(Entity item, Privileged privileged) throws ModelException {
		Assert.assertNull(modelService.get(Entity.class, item.getId(), privileged));
	}
	
	private void tryDeleteAndFail(Entity item, Privileged privileged) throws ModelException {
		boolean caught = false;
		try {
			modelService.deleteEntity(item, privileged);
		} catch (SecurityException e) {
			// Catch exception when trying to re-create user
			caught = true;
		}
		assertTrue(caught);
	}
	
	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
}
