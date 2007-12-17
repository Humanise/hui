package dk.in2isoft.onlineobjects.core;

import java.util.ArrayList;
import java.util.List;

public abstract class AbstractModelQuery {
	protected Class<?> clazz;
	protected List<ModelPropertyLimitation> limitations = new ArrayList<ModelPropertyLimitation>();
	
	public Class<?> getClazz() {
		return clazz;
	}
	
	public List<ModelPropertyLimitation> getLimitations() {
		return limitations;
	}
}
