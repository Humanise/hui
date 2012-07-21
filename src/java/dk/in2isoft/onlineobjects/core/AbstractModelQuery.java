package dk.in2isoft.onlineobjects.core;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Query;
import org.hibernate.Session;

import dk.in2isoft.onlineobjects.model.Entity;

public abstract class AbstractModelQuery<T> implements ModelQuery {
	protected Class<T> clazz;
	protected List<ModelPropertyLimitation> limitations = new ArrayList<ModelPropertyLimitation>();
	protected Map<String,Object> customProperties = new HashMap<String, Object>();
	protected Privileged[] privileged;
	protected String[] words;
	protected int pageSize;
	protected int pageNumber;
	protected Date createdFrom;
	protected Date createdTo;
	//protected Entity parent;
	protected String parentKind;
	protected Entity child;
	protected String childKind;
	protected Long[] ids;

	public Class<T> getClazz() {
		return clazz;
	}
	
	public List<ModelPropertyLimitation> getLimitations() {
		return limitations;
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

	public Map<String, Object> getCustomProperties() {
		return customProperties;
	}
	/*
	public Entity getParent() {
		return parent;
	}*/
	
	public Entity getChild() {
		return child;
	}

	abstract public Query createItemQuery(Session session);
	
}
