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
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestAdminUser extends AbstractSpringTestCase {

	@Autowired
	private SecurityService securityService;
	
	@Test
	public void testLoadUser() throws EndUserException {
		User admin = modelService.getUser(SecurityService.ADMIN_USERNAME);
		Assert.assertNotNull(admin);
		Assert.assertEquals(SecurityService.ADMIN_USERNAME, admin.getUsername());
	}
	
	@Test
	public void testDeleteUser() throws EndUserException {
		User admin = modelService.getUser(SecurityService.ADMIN_USERNAME);
		assertFalse(securityService.canDelete(admin, admin));
		tryDeleteAndFail(admin, admin);
	}
	
	private void tryDeleteAndFail(Entity item, Privileged privileged) throws ModelException {
		boolean caught = false;
		try {
			modelService.deleteEntity(item, privileged);
		} catch (SecurityException e) {
			// Catch exception when trying to delete
			caught = true;
		}
		assertTrue(caught);
	}
	
	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
}
