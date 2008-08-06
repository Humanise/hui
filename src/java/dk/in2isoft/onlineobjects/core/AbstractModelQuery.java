package dk.in2isoft.onlineobjects.core;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import dk.in2isoft.onlineobjects.model.Entity;

public abstract class AbstractModelQuery<T> {
	protected Class<T> clazz;
	protected List<ModelPropertyLimitation> limitations = new ArrayList<ModelPropertyLimitation>();
	protected Map<String,Object> properties = new HashMap<String, Object>();
	protected Priviledged priviledged;
	protected String[] words;
	protected int pageSize;
	protected int pageNumber;
	protected Date createdFrom;
	protected Date createdTo;
	public Entity parent;
	public Entity child;

	public Class<T> getClazz() {
		return clazz;
	}
	
	public List<ModelPropertyLimitation> getLimitations() {
		return limitations;
	}
	
	public Priviledged getPriviledged() {
		return priviledged;
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
		return properties;
	}
	
	public Entity getParent() {
		return parent;
	}
	
	public Entity getChild() {
		return child;
	}
	
}
