package dk.in2isoft.commons.vcard;

import java.util.ArrayList;
import java.util.List;

public class VCard {

	private String familyName;
	private String givenName;
	private String additionalName;
	private String namePrefix;
	private String nameSuffix;
	private String title;
	private List<VCardEmail> emails;
	private List<VCardPhone> phones;

	public VCard() {
		emails = new ArrayList<VCardEmail>();
		phones = new ArrayList<VCardPhone>();
	}

	public String getGivenName() {
		return givenName;
	}

	public void setGivenName(String firstName) {
		this.givenName = firstName;
	}

	public String getFamilyName() {
		return familyName;
	}

	public void setFamilyName(String surName) {
		this.familyName = surName;
	}

	public String getAdditionalName() {
		return additionalName;
	}

	public void setAdditionalName(String additionalName) {
		this.additionalName = additionalName;
	}

	public String getNamePrefix() {
		return namePrefix;
	}

	public void setNamePrefix(String namePrefix) {
		this.namePrefix = namePrefix;
	}

	public String getNameSuffix() {
		return nameSuffix;
	}

	public void setNameSuffix(String nameSuffix) {
		this.nameSuffix = nameSuffix;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
	
	public List<VCardEmail> getEmails() {
		return emails;
	}

	public void setEmails(List<VCardEmail> emails) {
		this.emails = emails;
	}

	public List<VCardPhone> getPhones() {
		return phones;
	}

	public void setPhones(List<VCardPhone> phones) {
		this.phones = phones;
	}

}
