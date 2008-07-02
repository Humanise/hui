package dk.in2isoft.onlineobjects.model;

import dk.in2isoft.commons.lang.LangUtil;

public class Person extends Entity {

	public static String TYPE = Entity.TYPE+"/Person";
	public static String NAMESPACE = Entity.NAMESPACE+"Person/";
	
	private String givenName;
	private String familyName;
	private String additionalName;
	private String namePrefix;
	private String nameSuffix;
	private Boolean sex;

	public Person() {
		super();
	}

	public String getType() {
		return super.getType()+"/Person";
	}

	public String getIcon() {
		if (sex==null) {
			return "Element/Person";
		} else if (sex) {
			return "Role/Male";
		} else {
			return "Role/Female";
		}
	}
	
	public String getGivenName() {
		return givenName;
	}

	public void setGivenName(String firstName) {
		this.givenName = firstName;
		updateName();
	}

	public String getFamilyName() {
		return familyName;
	}

	public void setFamilyName(String lastName) {
		this.familyName = lastName;
		updateName();
	}

	public String getAdditionalName() {
		return additionalName;
	}

	public void setAdditionalName(String additionalName) {
		this.additionalName = additionalName;
		updateName();
	}

	public String getNamePrefix() {
		return namePrefix;
	}

	public void setNamePrefix(String namePrefix) {
		this.namePrefix = namePrefix;
		updateName();
	}

	public String getNameSuffix() {
		return nameSuffix;
	}

	public void setNameSuffix(String nameSuffix) {
		this.nameSuffix = nameSuffix;
		updateName();
	}

	private void updateName() {
		setName(LangUtil.concatWords(new String[] {namePrefix, givenName,additionalName,familyName,nameSuffix}));
	}

	public Boolean getSex() {
		return sex;
	}

	public void setSex(Boolean sex) {
		this.sex = sex;
	}
}
