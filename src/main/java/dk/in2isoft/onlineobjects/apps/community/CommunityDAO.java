package dk.in2isoft.onlineobjects.apps.community;

import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.AbstractDAO;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EntitylistSynchronizer;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.PhoneNumber;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.services.EmailService;

public class CommunityDAO extends AbstractDAO {
	
	public void sendFeedback(String emailAddress,String message) throws EndUserException {
		EmailService emailService = Core.getInstance().getBean(EmailService.class);
		emailService.sendMessage("Feedback", "Email: "+emailAddress+"\n\n"+message, emailService.getDefaultSenderAddress());
	}
	
	public void updateDummyEmailAddresses(Entity parent,List<EmailAddress> addresses, Privileged session) throws EndUserException {
		
		// Remove empty addresses
		for (Iterator<EmailAddress> i = addresses.iterator(); i.hasNext();) {
			EmailAddress emailAddress = i.next();
			if (!Strings.isNotBlank(emailAddress.getAddress())) {
				i.remove();
			}
		}
		
		List<EmailAddress> existing = getModel().getChildren(parent, EmailAddress.class);
		EntitylistSynchronizer<EmailAddress> sync = new EntitylistSynchronizer<EmailAddress>(existing,addresses);
		
		for (Entry<EmailAddress, EmailAddress> entry : sync.getUpdated().entrySet()) {
			EmailAddress original = entry.getKey();
			EmailAddress dummy = entry.getValue();
			original.setAddress(dummy.getAddress());
			original.setContext(dummy.getContext());
		}
		
		for (EmailAddress emailAddress : sync.getNew()) {
			getModel().createItem(emailAddress, session);
			getModel().createRelation(parent, emailAddress, session);
		}
		
		for (EmailAddress emailAddress : sync.getDeleted()) {
			getModel().deleteEntity(emailAddress, session);
		}
	}

	
	public void updateDummyPhoneNumbers(Entity parent,List<PhoneNumber> phones, Privileged priviledged) throws EndUserException {

		// Remove empty addresses
		for (Iterator<PhoneNumber> i = phones.iterator(); i.hasNext();) {
			PhoneNumber number = i.next();
			if (!Strings.isNotBlank(number.getNumber())) {
				i.remove();
			}
		}
		List<PhoneNumber> existing = getModel().getChildren(parent, PhoneNumber.class);
		EntitylistSynchronizer<PhoneNumber> sync = new EntitylistSynchronizer<PhoneNumber>(existing,phones);
		
		for (Entry<PhoneNumber, PhoneNumber> entry : sync.getUpdated().entrySet()) {
			PhoneNumber original = entry.getKey();
			PhoneNumber dummy = entry.getValue();
			original.setNumber(dummy.getNumber());
			original.setContext(dummy.getContext());
		}
		
		for (PhoneNumber number : sync.getNew()) {
			getModel().createItem(number, priviledged);
			getModel().createRelation(parent, number, priviledged);
		}
		
		for (PhoneNumber number : sync.getDeleted()) {
			getModel().deleteEntity(number, priviledged);
		}
	}

	public void updateDummyInternetAddresses(Entity parent, List<InternetAddress> urls, Privileged priviledged) throws ModelException, SecurityException {

		// Remove empty addresses
		for (Iterator<InternetAddress> i = urls.iterator(); i.hasNext();) {
			InternetAddress address = i.next();
			if (!Strings.isNotBlank(address.getAddress())) {
				i.remove();
			}
		}
		List<InternetAddress> existing = getModel().getChildren(parent, InternetAddress.class);
		EntitylistSynchronizer<InternetAddress> sync = new EntitylistSynchronizer<InternetAddress>(existing,urls);
		
		for (Entry<InternetAddress, InternetAddress> entry : sync.getUpdated().entrySet()) {
			InternetAddress original = entry.getKey();
			InternetAddress dummy = entry.getValue();
			original.setAddress(dummy.getAddress());
			original.setContext(dummy.getContext());
		}
		
		for (InternetAddress number : sync.getNew()) {
			getModel().createItem(number, priviledged);
			getModel().createRelation(parent, number, priviledged);
		}
		
		for (InternetAddress number : sync.getDeleted()) {
			getModel().deleteEntity(number, priviledged);
		}
	}

	@Deprecated
	public UserProfileInfo build(Person person,Privileged priviledged) throws ModelException {
		ModelService model = Core.getInstance().getModel();
		UserProfileInfo info = new UserProfileInfo();
		info.setGivenName(person.getGivenName());
		info.setFamilyName(person.getFamilyName());
		info.setAdditionalName(person.getAdditionalName());
		info.setSex(person.getSex());
		info.setResume(person.getPropertyValue(Property.KEY_HUMAN_RESUME));
		info.setInterests(person.getPropertyValues(Property.KEY_HUMAN_INTEREST));
		info.setMusic(person.getPropertyValues(Property.KEY_HUMAN_FAVORITE_MUSIC));
		info.setMovies(person.getPropertyValues(Property.KEY_HUMAN_FAVORITE_MOVIE));
		info.setBooks(person.getPropertyValues(Property.KEY_HUMAN_FAVORITE_BOOK));
		info.setTelevisionPrograms(person.getPropertyValues(Property.KEY_HUMAN_FAVORITE_TELEVISIONPROGRAM));
		info.setEmails(model.getChildren(person, EmailAddress.class));
		info.setPhones(model.getChildren(person, PhoneNumber.class));
		info.setUrls(model.getChildren(person, InternetAddress.class));
		return info;
	}
	
	public void save(UserProfileInfo info,Person person,Privileged priviledged) throws EndUserException {
		ModelService model = Core.getInstance().getModel();
		person.setGivenName(info.getGivenName());
		person.setAdditionalName(info.getAdditionalName());
		person.setFamilyName(info.getFamilyName());
		person.setSex(info.getSex());
		person.overrideFirstProperty(Property.KEY_HUMAN_RESUME, info.getResume());
		person.overrideProperties(Property.KEY_HUMAN_INTEREST, info.getInterests());
		person.overrideProperties(Property.KEY_HUMAN_FAVORITE_MUSIC, info.getMusic());
		person.overrideProperties(Property.KEY_HUMAN_FAVORITE_MOVIE, info.getMovies());
		person.overrideProperties(Property.KEY_HUMAN_FAVORITE_BOOK, info.getBooks());
		person.overrideProperties(Property.KEY_HUMAN_FAVORITE_TELEVISIONPROGRAM, info.getTelevisionPrograms());
		CommunityDAO dao = CommunityController.getDAO();
		model.updateItem(person, priviledged);
		dao.updateDummyEmailAddresses(person, info.getEmails(), priviledged);
		dao.updateDummyPhoneNumbers(person, info.getPhones(), priviledged);
		dao.updateDummyInternetAddresses(person, info.getUrls(), priviledged);
	}
}
