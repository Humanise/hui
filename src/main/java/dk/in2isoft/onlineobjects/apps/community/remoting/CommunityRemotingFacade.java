package dk.in2isoft.onlineobjects.apps.community.remoting;

import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.joda.time.DateTime;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.in2igui.data.ListData;
import dk.in2isoft.in2igui.data.ListDataRow;
import dk.in2isoft.in2igui.data.ListObjects;
import dk.in2isoft.in2igui.data.TextFieldData;
import dk.in2isoft.in2igui.data.WidgetData;
import dk.in2isoft.onlineobjects.apps.ApplicationSession;
import dk.in2isoft.onlineobjects.apps.community.CommunityController;
import dk.in2isoft.onlineobjects.apps.community.CommunityDAO;
import dk.in2isoft.onlineobjects.apps.community.UserProfileInfo;
import dk.in2isoft.onlineobjects.apps.community.services.InvitationService;
import dk.in2isoft.onlineobjects.apps.community.services.MemberService;
import dk.in2isoft.onlineobjects.core.LocationQuery;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserQuery;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Invitation;
import dk.in2isoft.onlineobjects.model.Location;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.PhoneNumber;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.services.SemanticService;
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
	private CommunityDAO communityDAO;
	private SemanticService semanticService;
	private SecurityService securityService;
	private HTMLService htmlService;

	public void signUp(String username, String password, String name, String email) throws EndUserException {
		memberService.signUp(getUserSession(),username,password,name,email);
	}
	
	public void signUpFromInvitation(String code, String username, String password) throws EndUserException {
		invitationService.signUpFromInvitation(getUserSession(), code, username, password);
	}

	public AsynchronousProcessDescriptor getProcess(String key) throws Exception {
		try {
			ApplicationSession toolSession = getUserSession().getApplicationSession(communityController);
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
		return communityDAO.build(person,getUserSession());
	}
	
	public void updateUserProfile(UserProfileInfo info) throws EndUserException {
		Person person = modelService.getChild(getUserSession().getUser(), Person.class);
		if (person==null) {
			throw new EndUserException("The user does not have a person!");
		}
		communityDAO.save(info, person, getUserSession());
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
			row.put("person", invited!=null ? invited.getName() : null);
			EmailAddress email = (EmailAddress) modelService.getChild(invited, EmailAddress.class);
			row.put("email", email!=null ? email.getAddress(): null);
			invites.add(row);
		}
		return invites;
	}
	
	/////////////////////////// Settings ////////////////////////

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

	public void updateUsersMainPerson(Person dummy, List<EmailAddress> adresses) throws EndUserException {
		Privileged priviledged = getUserSession();

		Person person = getUsersMainPerson();
		person.setGivenName(dummy.getGivenName());
		person.setFamilyName(dummy.getFamilyName());
		person.setNamePrefix(dummy.getNamePrefix());
		person.setNameSuffix(dummy.getNameSuffix());
		modelService.updateItem(person, priviledged);
		communityDAO.updateDummyEmailAddresses(person, adresses, getUserSession());
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
		map.put("users", searchUsers(query));
		map.put("tags", getTagCloud(query));
		return map;
	}

	public List<Image> getLatestImages(String text) {
		Query<Image> query = new Query<Image>(Image.class).withWords(text).orderByCreated().descending().withPaging(0, 10).withPrivileged(securityService.getPublicUser());
		return modelService.list(query);
	}

	public Collection<Map<String,Entity>> searchUsers(String query) throws ModelException {
		List<Map<String,Entity>> result = Lists.newArrayList(); 
		List<Pair<User, Person>> pairs = modelService.searchPairs(new UserQuery().withWords(query).withPaging(0, 10).withPublicView()).getList();
		for (Pair<User, Person> entry : pairs) {
			Map<String,Entity> map = Maps.newHashMap();
			map.put("user", entry.getKey());
			map.put("person", entry.getValue());
			result.add(map);
			
		}
		return result;
	}

	public Map<String, Float> getTagCloud(String query) throws EndUserException {
		return modelService.getPropertyCloud(Property.KEY_COMMON_TAG,query,Image.class);
	}

	public ListObjects listPersons() throws EndUserException {
		ListObjects list = new ListObjects();
		Query<Person> query = new Query<Person>(Person.class).withPrivileged(getUserSession());
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

	public ListObjects listImages(String text,String tag) throws EndUserException {
		ListObjects list = new ListObjects();
		Query<Image> query = new Query<Image>(Image.class).withPrivileged(getUserSession());
		query.withWords(text);
		if (tag!=null) {
			query.withCustomProperty(Property.KEY_COMMON_TAG, tag);
		}
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
	
	//////////////// Internet addresses ////////////////

	public ListData listPrivateBookmarks(String search, String tag,int page) throws EndUserException {
		Query<InternetAddress> query = new Query<InternetAddress>(InternetAddress.class).withPrivileged(getUserSession()).withWords(search);
		query.withPaging(page, 30);
		if (tag!=null) {
			query.withCustomProperty(Property.KEY_COMMON_TAG, tag);
		}
		SearchResult<InternetAddress> result = modelService.search(query);
		
		List<InternetAddress> addresses = result.getList();
		ListData list = new ListData();
		list.setWindow(result.getTotalCount(), 30, page);
		list.addHeader("Titel");
		list.addHeader("Adresse");
		for (InternetAddress address : addresses) {
			Map<String,String> data = Maps.newHashMap();
			data.put("address", address.getAddress());
			list.newRow(address.getId(), "internetAddress", data);
			list.addCell(address.getName(),"common/internet");
			list.addCell(address.getAddress(),"monochrome/globe");
		}
		return list;
	}
	
	public InternetAddressInfo getInternetAddress(long id) throws ModelException {
		InternetAddress address = modelService.get(InternetAddress.class, id, getRequest().getSession());
		if (address!=null) {
			InternetAddressInfo info = new InternetAddressInfo();
			info.setId(address.getId());
			info.setName(address.getName());
			info.setAddress(address.getAddress());
			info.setDescription(address.getPropertyValue(Property.KEY_COMMON_DESCRIPTION));
			info.setTags(address.getPropertyValues(Property.KEY_COMMON_TAG));
			return info;
		}
		return null;
	}
	
	public InternetAddressInfo lookupInternetAddress(String url) throws ModelException, MalformedURLException, IllegalRequestException {
		if (!url.startsWith("http")) {
			url = "http://"+url;
		}
		HTMLDocument doc = htmlService.getDocumentSilently(url);
		if (doc==null) {
			throw new IllegalRequestException("Not HTML");
		}
		InternetAddressInfo info = new InternetAddressInfo();
		info.setName(doc.getTitle());
		info.setAddress(url);
		String[] words = semanticService.getWords(doc.getText().toLowerCase());
		List<String> tags = Lists.newArrayList();
		Map<String, Integer> properties = modelService.getProperties(Property.KEY_COMMON_TAG, InternetAddress.class, getUserSession());
		Set<String> existing = properties.keySet();
		for (String tag : existing) {
			if (ArrayUtils.contains(words, tag.toLowerCase())) {
				tags.add(tag);
			}
		}
		info.setTags(tags);
		return info;
	}
	
	public void saveInternetAddress(InternetAddressInfo info) throws ModelException, SecurityException, IllegalRequestException {
		InternetAddress address;
		if (info.getId()!=null) {
			address = modelService.get(InternetAddress.class, info.getId(), getRequest().getSession());
			if (address==null) {
				throw new IllegalRequestException("Not found");
			}
		} else {
			address = new InternetAddress();
		}
		address.setAddress(info.getAddress());
		address.setName(info.getName());
		address.overrideFirstProperty(Property.KEY_COMMON_DESCRIPTION, info.getDescription());
		address.overrideProperties(Property.KEY_COMMON_TAG, info.getTags());
		modelService.createOrUpdateItem(address, getUserSession());
	}
	
	/////////////////////// Persons /////////////// 
	/*
	public Map<String,Object> loadPerson(long id) throws ModelException {
		Map<String,Object> data = new HashMap<String, Object>();
		Person person = modelService.get(Person.class, id, getRequest().getSession());
		data.put("person", person);
		List<EmailAddress> emails = modelService.getChildren(person, EmailAddress.class);
		data.put("emails", emails);
		List<PhoneNumber> phones = modelService.getChildren(person, PhoneNumber.class);
		data.put("phones", phones);
		return data;
	}*/
	
	public Map<String,Object> getImage(long id) throws ModelException {
		Map<String,Object> data = new HashMap<String, Object>();
		Image image = modelService.get(Image.class, id, getRequest().getSession());
		data.put("image", image);
		data.put("name", image.getName());
		data.put("description", image.getPropertyValue(Image.PROPERTY_DESCRIPTION));
		data.put("tags", image.getPropertyValues(Property.KEY_COMMON_TAG));
		return data;
	}
	
	public void updateImage(long id,String name,String description, List<String> tags) throws EndUserException {
		Image image = modelService.get(Image.class, id, getRequest().getSession());
		image.setName(name);
		image.overrideFirstProperty(Image.PROPERTY_DESCRIPTION, description);
		image.overrideProperties(Property.KEY_COMMON_TAG, tags);
		modelService.updateItem(image, getUserSession());
	}
	
	public ImageInfo getImageInfo(long id) throws EndUserException {
		Image image = modelService.get(Image.class, id, getRequest().getSession());
		if (image==null) {
			throw new IllegalRequestException("Image not found");
		}
		return imageService.getImageInfo(image);
	}
	
	public void updateImageInfo(ImageInfo info) throws EndUserException {
		UserSession priviledged = getUserSession();
		imageService.updateImageInfo(info, priviledged);
	}
	
	public void savePerson(Person dummy,List<EmailAddress> addresses,List<PhoneNumber> phones) throws EndUserException {
		Person person;
		if (dummy.getId()>0) {
			person = modelService.get(Person.class, dummy.getId(), getRequest().getSession());
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
		communityDAO.updateDummyEmailAddresses(person, addresses, getUserSession());
		communityDAO.updateDummyPhoneNumbers(person, phones, getUserSession());
	}
	
	public void sendFeedback(String emailAddress,String message) throws EndUserException {
		emailAddress = emailAddress.trim();
		message = message.trim();
		if (!Strings.isNotBlank(emailAddress)) {
			throw new EndUserException("The email address is empty!");
		} else if (!ValidationUtil.isWellFormedEmail(emailAddress)) {
			throw new EndUserException("The email address is not well formed!");
		} else if (!Strings.isNotBlank(message)) {
			throw new EndUserException("The message is empty!");
		}
		communityDAO.sendFeedback(emailAddress, message);
	}
	
	////////////// Geo /////////////
	
	public Location getImageLocation(long id) throws EndUserException {
		Image image = modelService.get(Image.class, id, getRequest().getSession());
		if (image==null) {
			throw new IllegalRequestException("Image not found");
		}
		return modelService.getParent(image, Location.class);
	}
	
	public List<Pair<Location, Image>> searchLocations(MapQuery mapQuery) throws EndUserException {
		LocationQuery<Image> query = new LocationQuery<Image>(Image.class).withWords(mapQuery.getWords()).withPaging(0, 50);
		if (mapQuery.getNorthEast()!=null && mapQuery.getSouthWest()!=null) {
			query.withBounds(mapQuery.getNorthEast(),mapQuery.getSouthWest());
		}
		return modelService.searchPairs(query).getList();	
	}
	
	////////////////// Services ////////////////

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

	public void setCommunityDAO(CommunityDAO communityDAO) {
		this.communityDAO = communityDAO;
	}

	public CommunityDAO getCommunityDAO() {
		return communityDAO;
	}

	public void setSemanticService(SemanticService semanticService) {
		this.semanticService = semanticService;
	}

	public SemanticService getSemanticService() {
		return semanticService;
	}

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}

	public SecurityService getSecurityService() {
		return securityService;
	}
	
	public void setHtmlService(HTMLService htmlService) {
		this.htmlService = htmlService;
	}
}
