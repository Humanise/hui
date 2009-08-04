package dk.in2isoft.onlineobjects.apps.community.remoting;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.joda.time.DateTime;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import dk.in2isoft.commons.lang.LangUtil;
import dk.in2isoft.in2igui.data.ListDataRow;
import dk.in2isoft.in2igui.data.ListObjects;
import dk.in2isoft.in2igui.data.TextFieldData;
import dk.in2isoft.in2igui.data.WidgetData;
import dk.in2isoft.onlineobjects.apps.ApplicationSession;
import dk.in2isoft.onlineobjects.apps.community.CommunityController;
import dk.in2isoft.onlineobjects.apps.community.CommunityDAO;
import dk.in2isoft.onlineobjects.apps.community.UserProfileInfo;
import dk.in2isoft.onlineobjects.apps.community.UserProfileInfoUtil;
import dk.in2isoft.onlineobjects.apps.community.services.InvitationService;
import dk.in2isoft.onlineobjects.apps.community.services.MemberService;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.LocationQuery;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.Priviledged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.UserQuery;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Invitation;
import dk.in2isoft.onlineobjects.model.Location;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.PhoneNumber;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;
import dk.in2isoft.onlineobjects.ui.AsynchronousProcessDescriptor;
import dk.in2isoft.onlineobjects.util.ValidationUtil;
import dk.in2isoft.onlineobjects.util.images.ImageInfo;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class CommunityRemotingFacade extends AbstractRemotingFacade {

	private static Logger log = Logger.getLogger(CommunityRemotingFacade.class);
	
	private InvitationService invitationService;
	private MemberService memberService;
	private ImageService imageService;
	private CommunityController communityController;

	public void signUp(String username, String password, String name, String email) throws EndUserException {
		memberService.signUp(getUserSession(),username,password,name,email);
	}
	
	public void signUpFromInvitation(String code, String username, String password) throws EndUserException {
		invitationService.signUpFromInvitation(getUserSession(), code, username, password);
	}

	public AsynchronousProcessDescriptor getProcess(String key) throws Exception {
		try {
			ApplicationSession toolSession = getUserSession().getToolSession(communityController);
			log.debug(toolSession);
			return toolSession.getAsynchronousProcessDescriptor(key);
		} catch (Exception e) {
			log.debug(e);
			throw e;
		}
	}

	public List<Entity> search(String query) {
		return modelService.list(new Query<Entity>(Entity.class).withWords(query));
	}

	public Collection<WidgetData> getProfileGuiData() throws EndUserException {
		List<Person> persons = modelService.getChildren(getUserSession().getUser(), Person.class);
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

	public UserProfileInfo getUserProfile() throws EndUserException {
		Person person = modelService.getChild(getUserSession().getUser(), Person.class);
		if (person==null) {
			throw new EndUserException("The user does not have a person!");
		}
		return UserProfileInfoUtil.build(person,getUserSession());
	}
	
	public void updateUserProfile(UserProfileInfo info) throws EndUserException {
		Person person = modelService.getChild(getUserSession().getUser(), Person.class);
		if (person==null) {
			throw new EndUserException("The user does not have a person!");
		}
		UserProfileInfoUtil.save(info, person, getUserSession());
	}

	public List<Map<String, Object>> getInvitations() throws EndUserException {
		List<Map<String, Object>> invites = new ArrayList<Map<String, Object>>();
		List<Invitation> invitations = modelService.getChildren(getUserSession().getUser(), Invitation.class);
		
		for (Iterator<Invitation> i = invitations.iterator(); i.hasNext();) {
			Map<String, Object> row = new HashMap<String, Object>();
			Invitation invitation = i.next();
			DateTime created = new DateTime(invitation.getCreated().getTime());
			row.put("id", invitation.getId());
			row.put("created", created.toString("d/M-yyyy HH:mm"));
			row.put("code", invitation.getCode());
			row.put("state", invitation.getState());
			Person invited = (Person) modelService.getChild(invitation, Person.class);
			row.put("person", invited.getName());
			EmailAddress email = (EmailAddress) modelService.getChild(invited, EmailAddress.class);
			row.put("email", email.getAddress());
			invites.add(row);
		}
		return invites;
	}

	public Person getUsersMainPerson() throws EndUserException {
		List<Person> persons = modelService.getChildren(getUserSession().getUser(), Person.class);
		if (persons.size() > 0) {
			return (Person) persons.get(0);
		} else {
			throw new EndUserException("The user does not have a person!");
		}
	}

	public List<EmailAddress> getUsersMainPersonsAddresses() throws EndUserException {
		Person person = getUsersMainPerson();
		List<EmailAddress> addresses = modelService.getChildren(person, EmailAddress.class);
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
		modelService.createItem(person, getUserSession());
		
		EmailAddress email = new EmailAddress();
		email.setAddress(emailAddress);
		modelService.createItem(email, getUserSession());
		
		Relation personEmail = new Relation(person,email);
		modelService.createItem(personEmail, getUserSession());
		
		Invitation invitation = invitationService.createInvitation(getUserSession(), person, message);
		invitationService.sendInvitation(invitation);
		return invitation;
	}
	
	public Map<String,Object> getLatest(String query) throws EndUserException {
		HashMap<String,Object> map = Maps.newHashMap();
		map.put("images", getLatestImages(query));
		map.put("users", searchUsers2(query));
		map.put("tags", getTagCloud(query));
		return map;
	}

	public List<Image> getLatestImages(String query) {
		return modelService.list(new Query<Image>(Image.class).withWords(query).orderByCreated().descending().withPaging(0, 10));
	}

	public List<User> searchUsers(String query) {
		List<User> users = modelService.list(new Query<User>(User.class).withWords(query).withPaging(0, 10));
		for (Iterator<User> i = users.iterator(); i.hasNext();) {
			User user = i.next();
			if (user.getUsername().equals("public") || user.getUsername().equals("admin")) {
				i.remove();
			}
		}
		return users;
	}

	public Collection<Map<String,Entity>> searchUsers2(String query) throws ModelException {
		List<Map<String,Entity>> result = Lists.newArrayList(); 
		List<Pair<User, Person>> pairs = modelService.searchPairs(new UserQuery().withWords(query).withPaging(0, 10)).getResult();
		for (Pair<User, Person> entry : pairs) {
			Map<String,Entity> map = Maps.newHashMap();
			map.put("user", entry.getKey());
			map.put("person", entry.getValue());
			result.add(map);
			
		}
		return result;
	}

	public List<Property> getLatestTags() throws EndUserException {
		List<Property> tags = modelService.getProperties(Property.KEY_COMMON_TAG);
		return tags;
	}

	public Map<String, Float> getTagCloud(String query) throws EndUserException {
		return modelService.getPropertyCloud(Property.KEY_COMMON_TAG,query);
	}

	public void updateUsersMainPerson(Person dummy, List<EmailAddress> adresses) throws EndUserException {
		Priviledged priviledged = getUserSession();

		Person person = getUsersMainPerson();
		person.setGivenName(dummy.getGivenName());
		person.setFamilyName(dummy.getFamilyName());
		person.setNamePrefix(dummy.getNamePrefix());
		person.setNameSuffix(dummy.getNameSuffix());
		modelService.updateItem(person, priviledged);
		CommunityDAO dao = CommunityController.getDAO();
		dao.updateDummyEmailAddresses(person, adresses, getUserSession());
	}

	public ListObjects listPersons() throws EndUserException {
		ListObjects list = new ListObjects();
		Query<Person> query = new Query<Person>(Person.class).withPriviledged(getUserSession());
		List<Person> persons = modelService.list(query);
		for (Person person : persons) {
			ListDataRow row = new ListDataRow();
			row.addColumn("id", person.getId());
			row.addColumn("name", person.getName());

			List<EmailAddress> email = modelService.getChildren(person, EmailAddress.class);
			row.addColumn("email", email);
			List<PhoneNumber> phones = modelService.getChildren(person, PhoneNumber.class);
			row.addColumn("phone", phones);
			list.addRow(row);
		}
		return list;
	}

	public ListObjects listImages() throws EndUserException {
		ListObjects list = new ListObjects();
		Query<Image> query = new Query<Image>(Image.class).withPriviledged(getUserSession());
		List<Image> persons = modelService.list(query);
		
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
		Person person = modelService.get(Person.class, id);
		data.put("person", person);
		List<EmailAddress> emails = modelService.getChildren(person, EmailAddress.class);
		data.put("emails", emails);
		List<PhoneNumber> phones = modelService.getChildren(person, PhoneNumber.class);
		data.put("phones", phones);
		return data;
	}
	
	public Map<String,Object> getImage(long id) throws ModelException {
		Map<String,Object> data = new HashMap<String, Object>();
		Image image = modelService.get(Image.class, id);
		data.put("image", image);
		data.put("name", image.getName());
		data.put("description", image.getPropertyValue(Image.PROPERTY_DESCRIPTION));
		data.put("tags", image.getPropertyValues(Property.KEY_COMMON_TAG));
		return data;
	}
	
	public void updateImage(long id,String name,String description, List<String> tags) throws EndUserException {
		Image image = modelService.get(Image.class, id);
		image.setName(name);
		image.overrideFirstProperty(Image.PROPERTY_DESCRIPTION, description);
		image.overrideProperties(Property.KEY_COMMON_TAG, tags);
		modelService.updateItem(image, getUserSession());
	}
	
	public ImageInfo getImageInfo(long id) throws EndUserException {
		Image image = modelService.get(Image.class, id);
		if (image==null) {
			throw new IllegalRequestException("Image not found");
		}
		return imageService.getImageInfo(image);
	}
	
	public void updateImageInfo(ImageInfo info) throws EndUserException {
		Image image = modelService.get(Image.class, info.getId());
		image.setName(info.getName());
		image.overrideFirstProperty(Image.PROPERTY_DESCRIPTION, info.getDescription());
		image.overrideFirstProperty(Property.KEY_PHOTO_TAKEN, info.getTaken());
		image.overrideProperties(Property.KEY_COMMON_TAG, info.getTags());
		modelService.updateItem(image, getUserSession());
	}
	
	public void savePerson(Person dummy,List<EmailAddress> addresses,List<PhoneNumber> phones) throws EndUserException {
		Person person;
		if (dummy.getId()>0) {
			person = modelService.get(Person.class, dummy.getId());
		} else {
			person = new Person();
		}
		person.setGivenName(dummy.getGivenName());
		person.setAdditionalName(dummy.getAdditionalName());
		person.setFamilyName(dummy.getFamilyName());
		person.setNamePrefix(dummy.getNamePrefix());
		person.setNameSuffix(dummy.getNameSuffix());
		if (person.getId()>0) {
			modelService.updateItem(person, getUserSession());
		} else {
			modelService.createItem(person, getUserSession());
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
		} else if (!ValidationUtil.isWellFormedEmail(emailAddress)) {
			throw new EndUserException("The email address is not well formed!");
		} else if (!LangUtil.isDefined(message)) {
			throw new EndUserException("The message is empty!");
		}
		CommunityController.getDAO().sendFeedback(emailAddress, message);
	}
	
	////////////// Geo /////////////
	
	public Location getImageLocation(long id) throws EndUserException {
		Image image = modelService.get(Image.class, id);
		if (image==null) {
			throw new IllegalRequestException("Image not found");
		}
		return modelService.getParent(image, Location.class);
	}
	
	public List<Pair<Location, Image>> searchLocations(String query) throws EndUserException {
		return modelService.searchPairs(new LocationQuery<Image>(Image.class).withWords(query).withPaging(0, 8)).getResult();
		
	}

	public void setInvitationService(InvitationService invitationService) {
		this.invitationService = invitationService;
	}

	public InvitationService getInvitationService() {
		return invitationService;
	}

	public void setMemberService(MemberService memberService) {
		this.memberService = memberService;
	}

	public MemberService getMemberService() {
		return memberService;
	}

	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}

	public ImageService getImageService() {
		return imageService;
	}

	public void setCommunityController(CommunityController communityController) {
		this.communityController = communityController;
	}

	public CommunityController getCommunityController() {
		return communityController;
	}
}
