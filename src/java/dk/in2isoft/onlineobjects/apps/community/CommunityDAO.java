package dk.in2isoft.onlineobjects.apps.community;

import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;

import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.SimpleEmail;

import dk.in2isoft.commons.lang.LangUtil;
import dk.in2isoft.onlineobjects.core.AbstractDAO;
import dk.in2isoft.onlineobjects.core.Configuration;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.EntitylistSynchronizer;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.Priviledged;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.PhoneNumber;

public class CommunityDAO extends AbstractDAO {
	
	public void sendFeedback(String emailAddress,String message) throws EndUserException {

		Configuration config = Core.getInstance().getConfiguration();
		try {
			SimpleEmail email = new SimpleEmail();
			email.setHostName(config.getMailHost());
			email.setAuthentication(config.getMailUsername(), config.getMailPassword());
			email.addTo("jonasmunk@mac.com", "Jonas Munk");
			email.setFrom("jonasmunk@mac.com", "Jonas Munk");
			email.setSubject("OnlineObjects feedback");
			email.setMsg("Email: "+emailAddress+"\n\n"+message);
			email.send();
		} catch (EmailException e) {
			throw new EndUserException(e);
		}
		
	}

	
	public void updateDummyEmailAddresses(Entity parent,List<EmailAddress> addresses, Priviledged session) throws EndUserException {
		
		// Remove empty addresses
		for (Iterator<EmailAddress> i = addresses.iterator(); i.hasNext();) {
			EmailAddress emailAddress = i.next();
			if (!LangUtil.isDefined(emailAddress.getAddress())) {
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

	
	public void updateDummyPhoneNumbers(Entity parent,List<PhoneNumber> phones, Priviledged priviledged) throws EndUserException {

		// Remove empty addresses
		for (Iterator<PhoneNumber> i = phones.iterator(); i.hasNext();) {
			PhoneNumber number = i.next();
			if (!LangUtil.isDefined(number.getNumber())) {
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

	public void updateDummyInternetAddresses(Entity parent, List<InternetAddress> urls, Priviledged priviledged) throws ModelException, SecurityException {

		// Remove empty addresses
		for (Iterator<InternetAddress> i = urls.iterator(); i.hasNext();) {
			InternetAddress address = i.next();
			if (!LangUtil.isDefined(address.getAddress())) {
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
}
