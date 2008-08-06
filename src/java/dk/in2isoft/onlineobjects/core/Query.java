package dk.in2isoft.onlineobjects.core;

import java.util.Date;

import dk.in2isoft.commons.lang.LangUtil;
import dk.in2isoft.onlineobjects.model.Entity;

public class Query<T> extends AbstractModelQuery<T> {


	public Query(Class<T> clazz) {
		super();
		this.clazz = clazz;
	}
	
	public Query() {
		super();
	}
	
	public Query<T> withWords(String query) {
		if (LangUtil.isDefined(query)) {
            words = LangUtil.getWords(query);
		}
		return this;
	}
	
	public Query<T> withFieldValue(String property,Object value) {
		limitations.add(new ModelPropertyLimitation(property,value,ModelPropertyLimitation.Comparison.EQUALS));
		return this;
	}
	
	public Query<T> withFieldValueMoreThan(String property,Object value) {
		limitations.add(new ModelPropertyLimitation(property,value,ModelPropertyLimitation.Comparison.MORETHAN));
		return this;
	}
	
	public Query<T> withFieldValueLessThan(String property,Object value) {
		limitations.add(new ModelPropertyLimitation(property,value,ModelPropertyLimitation.Comparison.LESSTHAN));
		return this;
	}
	
	public Query<T> withCustomProperty(String key,Object value) {
		properties.put(key,value);
		return this;
	}
	
	public Query<T> withPriviledged(Priviledged priviledged) {
		this.priviledged = priviledged;
		return this;
	}
	
	public Query<T> withPaging(int pageNumber,int pageSize) {
		this.pageNumber = pageNumber;
		this.pageSize = pageSize;
		return this;
	}
	
	public Query<T> withCreatedFrom(Date date) {
		createdFrom = date;
		return this;
	}
	
	public Query<T> withCreatedTo(Date date) {
		createdTo = date;
		return this;
	}

	public Query<T> withParent(Entity entity) {
		super.parent = entity;
		return this;
	}

	public Query<T> withChild(Entity entity) {
		super.child = entity;
		return this;
	}

	public static <E>Query<E> ofType(Class<E> className) {
		return new Query<E>(className);
	}
}
