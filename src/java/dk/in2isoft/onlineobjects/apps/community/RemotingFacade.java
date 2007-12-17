package dk.in2isoft.onlineobjects.apps.community;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.joda.time.DateTime;

import dk.in2isoft.in2igui.data.TextFieldData;
import dk.in2isoft.in2igui.data.WidgetData;
import dk.in2isoft.onlineobjects.apps.ApplicationSession;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.ModelFacade;
import dk.in2isoft.onlineobjects.core.ModelQuery;
import dk.in2isoft.onlineobjects.core.Priviledged;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Invitation;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.WebNode;
import dk.in2isoft.onlineobjects.model.WebPage;
import dk.in2isoft.onlineobjects.model.util.WebModelUtil;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;
import dk.in2isoft.onlineobjects.ui.AsynchronousProcessDescriptor;

public class RemotingFacade extends AbstractRemotingFacade {

	private static Logger log = Logger.getLogger(RemotingFacade.class);

	public void signUp(String username, String password) throws EndUserException {
		CommunityController.getDAO().signUp(getUserSession(),username,password);
	}
	
	public void signUpFromInvitation(String code,String username, String password) throws EndUserException {
		CommunityController.getDAO().signUpFromInvitation(getUserSession(), code, username, password);
	}
	
	public long createWebPage(long webSiteId) throws EndUserException {
		return WebModelUtil.createWebPageOnSite(webSiteId, getUserSession());
	}

	public boolean deleteWebPage(long id) throws EndUserException {
		ModelFacade model = getModel();
		WebPage page = (WebPage) model.loadEntity(WebPage.class, id);
		if (page == null) {
			throw new EndUserException("The page does not exist");
		}
		List<Entity> nodes = model.getSuperEntities(page, WebNode.class);
		for (Entity node : nodes) {
			model.deleteEntity(node);
		}
		model.deleteEntity(page);
		return true;
	}

	public boolean updateWebNode(long id, String name) throws EndUserException {
		ModelFacade model = getModel();
		WebNode node = (WebNode) model.loadEntity(WebNode.class, id);
		node.setName(name);
		model.updateItem(node, getUserSession());
		return true;
	}

	public AsynchronousProcessDescriptor getProcess(String key) throws Exception {
		try {
			ApplicationSession toolSession = getUserSession().getToolSession("community");
			log.debug(toolSession);
			return toolSession.getAsynchronousProcessDescriptor(key);
		} catch (Exception e) {
			log.debug(e);
			throw e;
		}
	}

	public List<Entity> search(String query) {
		ModelQuery mq = new ModelQuery();
		mq.setWords(query.split(" "));
		List<Entity> entities = Core.getInstance().getModel().searchEntities(mq);
		return entities;
	}

	public void changePageTemplate(long pageId, String template) throws EndUserException {
		ModelFacade model = getModel();
		WebPage page = (WebPage) model.loadEntity(WebPage.class, pageId);
		page.overrideFirstProperty(WebPage.PROPERTY_TEMPLATE, template);
		model.updateItem(page, getUserSession());
	}

	public Collection<WidgetData> getProfileGuiData() throws EndUserException {
		List<Entity> persons = getModel().getSubEntities(getUserSession().getUser(), Person.class);
		if (persons.size() > 0) {
			Person person = (Person) persons.get(0);
			Collection<WidgetData> list = new ArrayList<WidgetData>();
			list.add(new TextFieldData("namePrefix", person.getNamePrefix()));
			list.add(new TextFieldData("givenName", person.getGivenName()));
			list.add(new TextFieldData("familyName", person.getFamilyName()));
			list.add(new TextFieldData("additionalName", person.getAdditionalName()));
			list.add(new TextFieldData("nameSuffix", person.getNameSuffix()));
			return list;
		} else {
			throw new EndUserException("The user does not have a person!");
		}
	}

	public List<Map<String, Object>> getInvitations() throws EndUserException {
		List<Map<String, Object>> invites = new ArrayList<Map<String, Object>>();
		List<Entity> invitations = getModel().getSubEntities(getUserSession().getUser(), Invitation.class);
		
		for (Iterator<Entity> i = invitations.iterator(); i.hasNext();) {
			Map<String, Object> row = new HashMap<String, Object>();
			Invitation invitation = (Invitation) i.next();
			DateTime created = new DateTime(invitation.getCreated().getTime());
			row.put("id", invitation.getId());
			row.put("created", created.toString("d/M-yyyy HH:mm"));
			row.put("code", invitation.getCode());
			row.put("state", invitation.getState());
			Person invited = (Person) getModel().getFirstSubEntity(invitation, Person.class);
			row.put("person", invited.getName());
			EmailAddress email = (EmailAddress) getModel().getFirstSubEntity(invited, EmailAddress.class);
			row.put("email", email.getAddress());
			invites.add(row);
		}
		return invites;
	}

	public Person getUsersMainPerson() throws EndUserException {
		List<Entity> persons = getModel().getSubEntities(getUserSession().getUser(), Person.class);
		if (persons.size() > 0) {
			return (Person) persons.get(0);
		} else {
			throw new EndUserException("The user does not have a person!");
		}
	}

	public List<Entity> getUsersMainPersonsAddresses() throws EndUserException {
		Person person = getUsersMainPerson();
		List<Entity> addresses = getModel().getSubEntities(person, EmailAddress.class);
		return addresses;
	}

	public Invitation createInvitation(String name, String emailAddress, String message) throws EndUserException {
		String[] names = StringUtils.split(name);
		if (names==null || names.length==0) {
			throw new IllegalRequestException("Name is empty");
		}
		Person person = new Person();
		if (names.length>0) {
			person.setGivenName(names[0]);
		}
		if (names.length>1) {
			person.setFamilyName(names[names.length-1]);
		}
		getModel().saveItem(person, getUserSession());
		
		EmailAddress email = new EmailAddress();
		email.setAddress(emailAddress);
		getModel().saveItem(email, getUserSession());
		
		Relation personEmail = new Relation(person,email);
		getModel().saveItem(personEmail, getUserSession());
		
		CommunityDAO dao = CommunityController.getDAO();
		Invitation invitation = dao.createInvitation(getUserSession(), person, message);
		dao.sendInvitation(invitation);
		return invitation;
	}

	public List<Entity> getLatestImages() throws EndUserException {
		List<Entity> images = getModel().listEntities(Image.class);
		return images;
	}

	public void updateUsersMainPerson(Person dummy, EmailAddress[] adresses) throws EndUserException {
		Priviledged priviledged = getUserSession();

		Person person = getUsersMainPerson();
		person.setGivenName(dummy.getGivenName());
		person.setFamilyName(dummy.getFamilyName());
		person.setNamePrefix(dummy.getNamePrefix());
		person.setNameSuffix(dummy.getNameSuffix());
		getModel().updateItem(person, priviledged);

		List<Entity> existing = getUsersMainPersonsAddresses();
		List<Long> found = new ArrayList<Long>();
		for (int i = 0; i < adresses.length; i++) {
			EmailAddress address = adresses[i];
			if (address.getAddress() != null && address.getAddress().length() > 0) {
				if (address.isNew()) {
					getModel().saveItem(address, priviledged);
					Relation personAddress = new Relation(person, address);
					getModel().saveItem(personAddress, priviledged);
				} else {
					// Reload the address
					EmailAddress reloaded = (EmailAddress) getModel().loadEntity(EmailAddress.class, address.getId());
					reloaded.setAddress(address.getAddress());
					reloaded.setContext(address.getContext());
					getModel().updateItem(reloaded, priviledged);
					found.add(reloaded.getId());
					// TODO: update reloaded address
				}
			}
		}
		for (Iterator<Entity> i = existing.iterator(); i.hasNext();) {
			Entity exist = i.next();
			if (!found.contains(exist.getId())) {
				getModel().deleteEntity(exist);
			}
		}
	}
}
