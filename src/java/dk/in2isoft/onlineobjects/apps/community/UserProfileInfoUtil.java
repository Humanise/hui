package dk.in2isoft.onlineobjects.apps.community;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Priviledged;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.PhoneNumber;
import dk.in2isoft.onlineobjects.model.Property;

public class UserProfileInfoUtil {

	public static UserProfileInfo build(Person person,Priviledged priviledged) throws ModelException {
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
	
	public static void save(UserProfileInfo info,Person person,Priviledged priviledged) throws EndUserException {
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
