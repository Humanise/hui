package dk.in2isoft.onlineobjects.core;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.model.Entity;

public abstract class AbstractModelQuery<T> implements ModelQuery {
	protected Class<T> clazz;
	protected List<FieldLimitation> fieldLimitations = new ArrayList<FieldLimitation>();
	protected List<PropertyLimitation> customProperties = Lists.newArrayList();
	protected Privileged[] privileged;
	protected String[] words;
	protected int pageSize;
	protected int pageNumber;
	protected Date createdFrom;
	protected Date createdTo;
	//protected Entity parent;
	protected String fromKind;
	protected Entity toEntity;
	protected String toKind;
	protected Long[] ids;

	public Class<T> getClazz() {
		return clazz;
	}
	
	public List<FieldLimitation> getFieldLimitations() {
		return fieldLimitations;
	}
	
	public Privileged[] getPrivileged() {
		return privileged;
	}
	
	public String[] getWords() {
		return words;
	}
	
	public int getPageSize() {
		return pageSize;
	}

	public int getPageNumber() {
		return pageNumber;
	}

	public Date getCreatedFrom() {
		return createdFrom;
	}

	public Date getCreatedTo() {
		return createdTo;
	}

	public List<PropertyLimitation> getCustomProperties() {
		return customProperties;
	}
	/*
	public Entity getParent() {
		return parent;
	}*/
	
	public Entity getToEntity() {
		return toEntity;
	}

	abstract public Query createItemQuery(Session session);
	
}
