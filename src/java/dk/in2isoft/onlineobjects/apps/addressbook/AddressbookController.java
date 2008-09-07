package dk.in2isoft.onlineobjects.apps.addressbook;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.log4j.Logger;

import dk.in2isoft.commons.vcard.VCard;
import dk.in2isoft.commons.vcard.VCardEmail;
import dk.in2isoft.commons.vcard.VCardParser;
import dk.in2isoft.commons.vcard.VCardPhone;
import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.PhoneNumber;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.ui.Interface;
import dk.in2isoft.onlineobjects.ui.Request;

public class AddressbookController extends ApplicationController {

	private static Logger log = Logger.getLogger(AddressbookController.class);
	
	public AddressbookController() {
		super("addressbook");
	}

	@Override
	public void unknownRequest(Request request)
	throws IOException,EndUserException {
		Interface gui = new Base();
		gui.display(request);
	}

	public void addPerson(Request request)
	throws IOException,EndUserException {
		Interface gui = new AddPerson();
		gui.display(request);
	}

	public void editPerson(Request request)
	throws IOException,EndUserException {
		Person person = (Person)getModel().get(Person.class,request.getLong("id"));
		Interface gui = new EditPerson(person);
		gui.display(request);
	}

	public void createPerson(Request request)
	throws IOException,EndUserException {
		Person p = new Person();
		p.setGivenName(request.getString("firstName"));
		p.setFamilyName(request.getString("lastName"));
		String sex = request.getString("sex");
		if (sex.equals("male")) {
			p.setSex(true);
		} else if (sex.equals("female")) {
			p.setSex(false);
		}
		getModel().createItem(p,request.getSession());
		request.redirect(".");
	}

	public void updatePerson(Request request)
	throws IOException,EndUserException {
		Person person = (Person)getModel().get(Person.class,request.getLong("id"));
		person.setGivenName(request.getString("firstName"));
		person.setFamilyName(request.getString("lastName"));
		String sex = request.getString("sex");
		if (sex.equals("male")) {
			person.setSex(true);
		} else if (sex.equals("female")) {
			person.setSex(false);
		}
		getModel().updateItem(person,request.getSession());
		request.redirect(".");
	}

	public void deletePerson(Request request)
	throws IOException,EndUserException {
		Person person = (Person)getModel().get(Person.class,request.getLong("id"));
		getModel().deleteEntity(person,request.getSession());
		request.redirect(".");
	}

	public void importVCards(Request request)
	throws IOException,EndUserException {
		Interface gui = new ImportVCards();
		gui.display(request);
	}

	@SuppressWarnings("unchecked")
	public void uploadVCards(Request request)
	throws IOException,EndUserException {
		DiskFileItemFactory factory = new DiskFileItemFactory();
		factory.setRepository(Core.getInstance().getConfiguration().getTempDir());
		ServletFileUpload upload = new ServletFileUpload(factory);
		try {
			List<FileItem> items = upload.parseRequest(request.getRequest());
			for (Iterator<FileItem> iter = items.iterator(); iter.hasNext();) {
				FileItem element = iter.next();
				if (!element.isFormField()) {
					processVCards(element, request);
				}
			}
		} catch (Exception e) {
			throw new EndUserException(e);
		}
		request.redirect(".");
	}
	

	public void processVCards(FileItem fi,Request request) throws IOException,Exception {
		UserSession session = request.getSession();
		File temp = File.createTempFile("import", "vcf");
		fi.write(temp);
		VCardParser parser = new VCardParser();
		List<VCard> cards = parser.parse(temp);
		temp.delete();
		log.debug(cards.size());
		for (Iterator<VCard> iter = cards.iterator(); iter.hasNext();) {
			VCard card = iter.next();
			log.debug(card.getGivenName()+" "+card.getFamilyName()+" "+card.getTitle());
			Person person = new Person();
			person.setGivenName(card.getGivenName());
			person.setFamilyName(card.getFamilyName());
			person.setAdditionalName(card.getAdditionalName());
			person.setNamePrefix(card.getNamePrefix());
			person.setNameSuffix(card.getNameSuffix());
			person.getProperties().add(new Property("social.jobtitle",card.getTitle()));
			getModel().createItem(person,session);
			for (Iterator<VCardEmail> iterator = card.getEmails().iterator(); iterator.hasNext();) {
				VCardEmail mail = iterator.next();
				EmailAddress email = new EmailAddress();
				email.setAddress(mail.getAddress());
				getModel().createItem(email,session);
				getModel().createRelation(person, email,session);
			}
			for (Iterator<VCardPhone> iterator = card.getPhones().iterator(); iterator.hasNext();) {
				VCardPhone phone = iterator.next();
				PhoneNumber number = new PhoneNumber();
				number.setNumber(phone.getNumber());
				getModel().createItem(number,session);
				getModel().createRelation(person, number,session);
			}
		}
	}
	
}
