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

import dk.in2isoft.commons.lang.LangUtil;
import dk.in2isoft.in2igui.data.FormulaData;
import dk.in2isoft.in2igui.data.ListData;
import dk.in2isoft.in2igui.data.ListDataRow;
import dk.in2isoft.in2igui.data.TextFieldData;
import dk.in2isoft.in2igui.data.WidgetData;
import dk.in2isoft.onlineobjects.apps.ApplicationSession;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelFacade;
import dk.in2isoft.onlineobjects.core.Priviledged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Invitation;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.PhoneNumber;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.WebNode;
import dk.in2isoft.onlineobjects.model.WebPage;
import dk.in2isoft.onlineobjects.model.util.ModelClassInfo;
import dk.in2isoft.onlineobjects.model.util.WebModelUtil;
import dk.in2isoft.onlineobjects.publishing.Document;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;
import dk.in2isoft.onlineobjects.ui.AsynchronousProcessDescriptor;

public class CommunityRemotingFacade extends AbstractRemotingFacade {

	private static Logger log = Logger.getLogger(CommunityRemotingFacade.class);

	public void signUp(String username, String password) throws EndUserException {
		CommunityController.getDAO().signUp(getUserSession(),username,password);
	}
	
	public void signUpFromInvitation(String code,String username, String password) throws EndUserException {
		CommunityController.getDAO().signUpFromInvitation(getUserSession(), code, username, password);
	}
	
	public long createWebPage(long webSiteId,String template) throws EndUserException {
		log.info("New page with template: "+template);
		Class<?> docClass = getModel().getModelClass(template);
		return WebModelUtil.createWebPageOnSite(webSiteId, docClass, getUserSession());
	}

	public boolean deleteWebPage(long id) throws EndUserException {
		WebModelUtil.deleteWebPage(id,getUserSession());
		return true;
	}
	
	public Collection<ModelClassInfo> getDocumentClasses() {
		return getModel().getClassInfo(Document.class);
	}

	public boolean updateWebNode(long id, String name) throws EndUserException {
		ModelFacade model = getModel();
		WebNode node = model.get(WebNode.class, id);
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
		return getModel().search(new Query<Entity>(Entity.class).withWords(query));
	}

	public void changePageTemplate(long pageId, String template) throws EndUserException {
		ModelFacade model = getModel();
		WebPage page = model.get(WebPage.class, pageId);
		page.overrideFirstProperty(WebPage.PROPERTY_TEMPLATE, template);
		model.updateItem(page, getUserSession());
	}

	public Collection<WidgetData> getProfileGuiData() throws EndUserException {
		List<Person> persons = getModel().getChildren(getUserSession().getUser(), Person.class);
		if (persons.size() > 0) {
			Person person = persons.get(0);
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
		List<Invitation> invitations = getModel().getChildren(getUserSession().getUser(), Invitation.class);
		
		for (Iterator<Invitation> i = invitations.iterator(); i.hasNext();) {
			Map<String, Object> row = new HashMap<String, Object>();
			Invitation invitation = i.next();
			DateTime created = new DateTime(invitation.getCreated().getTime());
			row.put("id", invitation.getId());
			row.put("created", created.toString("d/M-yyyy HH:mm"));
			row.put("code", invitation.getCode());
			row.put("state", invitation.getState());
			Person invited = (Person) getModel().getChild(invitation, Person.class);
			row.put("person", invited.getName());
			EmailAddress email = (EmailAddress) getModel().getChild(invited, EmailAddress.class);
			row.put("email", email.getAddress());
			invites.add(row);
		}
		return invites;
	}

	public Person getUsersMainPerson() throws EndUserException {
		List<Person> persons = getModel().getChildren(getUserSession().getUser(), Person.class);
		if (persons.size() > 0) {
			return (Person) persons.get(0);
		} else {
			throw new EndUserException("The user does not have a person!");
		}
	}

	public List<EmailAddress> getUsersMainPersonsAddresses() throws EndUserException {
		Person person = getUsersMainPerson();
		List<EmailAddress> addresses = getModel().getChildren(person, EmailAddress.class);
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
		getModel().createItem(person, getUserSession());
		
		EmailAddress email = new EmailAddress();
		email.setAddress(emailAddress);
		getModel().createItem(email, getUserSession());
		
		Relation personEmail = new Relation(person,email);
		getModel().createItem(personEmail, getUserSession());
		
		CommunityDAO dao = CommunityController.getDAO();
		Invitation invitation = dao.createInvitation(getUserSession(), person, message);
		dao.sendInvitation(invitation);
		return invitation;
	}

	public List<Image> getLatestImages(String query) throws Exception {
		return getModel().search(new Query<Image>(Image.class).withWords(query).withPaging(0, 10));
	}

	public List<User> searchUsers(String query) throws Exception {
		List<User> users = getModel().search(new Query<User>(User.class).withWords(query).withPaging(0, 10));
		for (Iterator<User> i = users.iterator(); i.hasNext();) {
			User user = i.next();
			if (user.getUsername().equals("public") || user.getUsername().equals("admin")) {
				i.remove();
			}
		}
		return users;
	}

	public List<Property> getLatestTags() throws EndUserException {
		List<Property> tags = getModel().getProperties(Property.KEY_COMMON_TAG);
		return tags;
	}

	public Map<String, Float> getTagCloud(String query) throws EndUserException {
		return getModel().getPropertyCloud(Property.KEY_COMMON_TAG,query);
	}

	public void updateUsersMainPerson(Person dummy, List<EmailAddress> adresses) throws EndUserException {
		Priviledged priviledged = getUserSession();

		Person person = getUsersMainPerson();
		person.setGivenName(dummy.getGivenName());
		person.setFamilyName(dummy.getFamilyName());
		person.setNamePrefix(dummy.getNamePrefix());
		person.setNameSuffix(dummy.getNameSuffix());
		getModel().updateItem(person, priviledged);
		CommunityDAO dao = CommunityController.getDAO();
		dao.updateDummyEmailAddresses(person, adresses, getUserSession());
	}

	public ListData listPersons() throws EndUserException {
		ListData list = new ListData();
		Query<Person> query = new Query<Person>(Person.class).withPriviledged(getUserSession());
		List<Person> persons = getModel().search(query);
		for (Person person : persons) {
			ListDataRow row = new ListDataRow();
			row.addColumn("id", person.getId());
			row.addColumn("name", person.getName());

			List<EmailAddress> email = getModel().getChildren(person, EmailAddress.class);
			row.addColumn("email", email);
			List<PhoneNumber> phones = getModel().getChildren(person, PhoneNumber.class);
			row.addColumn("phone", phones);
			list.addRow(row);
		}
		return list;
	}

	public ListData listImages() throws EndUserException {
		ListData list = new ListData();
		Query<Image> query = new Query<Image>(Image.class).withPriviledged(getUserSession());
		List<Image> persons = getModel().search(query);
		
		for (Image image : persons) {
			ListDataRow row = new ListDataRow();
			row.addColumn("id", image.getId());
			row.addColumn("name", image.getName());
			row.addColumn("size", image.getWidth()+"x"+image.getHeight());
			row.addColumn("width", image.getWidth());
			row.addColumn("height", image.getHeight());
			list.addRow(row);
		}
		return list;
	}
	
	public Map<String,Object> loadPerson(long id) throws ModelException {
		Map<String,Object> data = new HashMap<String, Object>();
		Person person = getModel().get(Person.class, id);
		data.put("person", person);
		List<EmailAddress> emails = getModel().getChildren(person, EmailAddress.class);
		data.put("emails", emails);
		List<PhoneNumber> phones = getModel().getChildren(person, PhoneNumber.class);
		data.put("phones", phones);
		return data;
	}
	
	public Map<String,Object> getImage(long id) throws ModelException {
		Map<String,Object> data = new HashMap<String, Object>();
		Image image = getModel().get(Image.class, id);
		data.put("image", image);
		data.put("name", image.getName());
		data.put("description", image.getPropertyValue(Image.PROPERTY_DESCRIPTION));
		data.put("tags", image.getPropertyValues(Property.KEY_COMMON_TAG));
		return data;
	}
	
	public void updateImage(long id,String name,String description, List<String> tags) throws EndUserException {
		Image image = getModel().get(Image.class, id);
		image.setName(name);
		image.overrideFirstProperty(Image.PROPERTY_DESCRIPTION, description);
		image.overrideProperties(Property.KEY_COMMON_TAG, tags);
		getModel().updateItem(image, getUserSession());
	}
	
	public void savePerson(Person dummy,List<EmailAddress> addresses,List<PhoneNumber> phones) throws EndUserException {
		Person person;
		if (dummy.getId()>0) {
			person = getModel().get(Person.class, dummy.getId());
		} else {
			person = new Person();
		}
		person.setGivenName(dummy.getGivenName());
		person.setAdditionalName(dummy.getAdditionalName());
		person.setFamilyName(dummy.getFamilyName());
		person.setNamePrefix(dummy.getNamePrefix());
		person.setNameSuffix(dummy.getNameSuffix());
		if (person.getId()>0) {
			getModel().updateItem(person, getUserSession());
		} else {
			getModel().createItem(person, getUserSession());
		}
		CommunityDAO dao = CommunityController.getDAO();
		dao.updateDummyEmailAddresses(person, addresses, getUserSession());
		dao.updateDummyPhoneNumbers(person, phones, getUserSession());
	}
	
	public void sendFeedback(String emailAddress,String message) throws EndUserException {
		emailAddress = emailAddress.trim();
		message = message.trim();
		if (!LangUtil.isDefined(emailAddress)) {
			throw new EndUserException("The email address is empty!");
		} else if (!LangUtil.isWellFormedEmail(emailAddress)) {
			throw new EndUserException("The email address is not well formed!");
		} else if (!LangUtil.isDefined(message)) {
			throw new EndUserException("The message is empty!");
		}
		CommunityController.getDAO().sendFeedback(emailAddress, message);
	}

	public FormulaData getPageInfo(long pageId) throws EndUserException {
		ModelFacade model = getModel();
		WebPage page = model.get(WebPage.class, pageId);
		FormulaData data = new FormulaData();
		data.addValue("title", page.getName());
		data.addValue("tags", page.getPropertyValues(Property.KEY_COMMON_TAG));
		return data;
	}

	public void savePageInfo(long pageId,String title,List<String> tags) throws EndUserException {
		ModelFacade model = getModel();
		WebPage page = model.get(WebPage.class, pageId);
		page.setName(title);
		page.overrideProperties(Property.KEY_COMMON_TAG, tags);
		model.updateItem(page, getUserSession());
	}
}
