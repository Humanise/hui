package dk.in2isoft.onlineobjects.services;

import org.apache.commons.lang.StringUtils;
import org.joda.time.DateTime;
import org.joda.time.Period;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.apps.community.UserProfileInfo;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Address;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.PhoneNumber;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.User;

public class PersonService {

	private ModelService modelService;
	
	public Person getUsersMainPerson(User user) throws ModelException {
		return modelService.getChild(user, Person.class);
	}
	
	public Address getPersonsPreferredAddress(Person person) throws ModelException {
		return modelService.getChild(person, Property.KEY_COMMON_PREFERRED, Address.class);
	}
	
	public Person getOrCreatePerson(String text, Privileged privileged) throws ModelException {
		if (Strings.isBlank(text) || privileged == null) {
			return null;
		}
		text = text.replaceAll("[\\s]+", " ").trim();
		Query<Person> query = Query.after(Person.class).withName(text).withPrivileged(privileged);
		Person person = modelService.getFirst(query);
		if (person==null) {
			person = new Person();
			person.setFullName(text);
			modelService.createItem(person, privileged);
		}
		return person;
	}
	
	public String getFullPersonName(Person person, int maxLength) {
		String fullName = person.getFullName();
		String given = person.getGivenName();
		String givenFirst = abbreviate(given);
		String family = person.getFamilyName();
		String additional = person.getAdditionalName();
		String additionalFirst = abbreviate(additional);
		if (fullName.length()>maxLength) {

			String givenAdditionFirstFamily = Strings.concatWords(given, additionalFirst, family);
			if (givenAdditionFirstFamily.length()<=maxLength) {
				return givenAdditionFirstFamily;
			}
			
			String givenFamily = Strings.concatWords(given, family);
			if (givenFamily.length()<=maxLength) {
				return givenFamily;
			}
			
			String givenFirstFamily = Strings.concatWords(givenFirst, family);
			if (givenFirstFamily.length()<=maxLength) {
				return givenFirstFamily;
			}
		}
		return StringUtils.abbreviate(fullName,maxLength);
	}

	private String abbreviate(String name) {
		if (Strings.isBlank(name)) {
			return null;
		}
		return name.trim().substring(0, 1).toUpperCase()+".";
	}
	
	public void updatePersonsPreferredAddress(Person person, Address address, Privileged privileged) throws ModelException, SecurityException {
		Address existing = getPersonsPreferredAddress(person);
		if (existing!=null) {
			existing.setStreet(address.getStreet());
			existing.setCity(address.getCity());
			existing.setRegion(address.getRegion());
			existing.setPostalCode(address.getPostalCode());
			existing.setCountry(address.getCountry());
			modelService.updateItem(existing, privileged);
		} else {
			modelService.createItem(address, privileged);
			modelService.createRelation(person, address, Property.KEY_COMMON_PREFERRED, privileged);
		}
	}

	public UserProfileInfo getProfileInfo(Person person,Privileged priviledged) throws ModelException {
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
		info.setEmails(modelService.getChildren(person, EmailAddress.class,priviledged));
		info.setPhones(modelService.getChildren(person, PhoneNumber.class,priviledged));
		info.setUrls(modelService.getChildren(person, InternetAddress.class,priviledged));
		return info;
	}
	
	public Integer getYearsOld(Person person) {
		if (person==null || person.getBirthday()==null) {
			return null;
		}
		DateTime now = new DateTime();
		Period period = new Period(new DateTime(person.getBirthday()),now);
		return period.getYears();
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
}
