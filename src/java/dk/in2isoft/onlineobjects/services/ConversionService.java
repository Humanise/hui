package dk.in2isoft.onlineobjects.services;

import nu.xom.Node;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.conversion.EntityConverter;


public class ConversionService {

	//private static Logger log = Logger.getLogger(ConversionFacade.class);
		
	public EntityConverter getConverter(Class<?> classObj) {
		String className = classObj.getPackage().getName()+".conversion."+classObj.getSimpleName()+"Converter";
		//log.debug(className);
		try {
			Class<?> converterClass = Class.forName(className);
			EntityConverter entityConverter = (EntityConverter) converterClass.newInstance();
			return entityConverter;
		} catch (ClassNotFoundException e) {
			return new EntityConverter();
		} catch (InstantiationException e) {
			return new EntityConverter();
		} catch (IllegalAccessException e) {
			return new EntityConverter();
		}
	}
	
	public EntityConverter getConverter(Entity entity) {
		String[] types = entity.getType().split("/");
		String type = types[types.length-1];
		String className = entity.getClass().getPackage().getName()+".conversion."+type+"Converter";
		//log.debug(className);
		try {
			Class<?> converterClass = Class.forName(className);
			EntityConverter entityConverter = (EntityConverter) converterClass.newInstance();
			return entityConverter;
		} catch (ClassNotFoundException e) {
			return new EntityConverter();
		} catch (InstantiationException e) {
			return new EntityConverter();
		} catch (IllegalAccessException e) {
			return new EntityConverter();
		}
	}
		
	public final Node generateXML(Entity entity) throws ModelException {
		EntityConverter converter = getConverter(entity);
		return converter.generateXML(entity);
	}
	
}
