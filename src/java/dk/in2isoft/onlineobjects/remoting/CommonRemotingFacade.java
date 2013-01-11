package dk.in2isoft.onlineobjects.remoting;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.http.FileDownload;
import dk.in2isoft.in2igui.data.ItemData;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;

public class CommonRemotingFacade extends AbstractRemotingFacade {

	private SecurityService securityService;
	private static Logger log = Logger.getLogger(CommonRemotingFacade.class);
	
	public Entity getEntity(long id) throws ModelException {
		return modelService.get(Entity.class, id, getUserSession());
	}
	
	public void deleteEntity(long id) throws ModelException, SecurityException {
		Entity entity = modelService.get(Entity.class, id, getUserSession());
		modelService.deleteEntity(entity, getUserSession());
	}
	
	public Collection<ItemData> getClasses() {
		Collection<Class<? extends Entity>> classes = modelService.getEntityClasses();
		Collection<ItemData> items = Lists.newArrayList();
		for (Class<?> clazz : classes) {
			ItemData data = new ItemData();
			data.setValue(clazz.getCanonicalName());
			data.setTitle(clazz.getSimpleName());
			data.setIcon("common/folder");
			items.add(data);
		}
		return items;
	}
	
	public void addTag(long id,String tag) throws ModelException, SecurityException {
		if (StringUtils.isBlank(tag)) {
			return;
		}
		Entity entity = modelService.get(Entity.class, id, getUserSession());
		if (entity==null) {
			return;
		}
		List<String> existingTags = entity.getPropertyValues(Property.KEY_COMMON_TAG);
		if (!existingTags.contains(tag)) {
			entity.addProperty(Property.KEY_COMMON_TAG, tag);
			modelService.updateItem(entity, getUserSession());
		} else {
			log.info("The tag ["+tag+"] already exists");
		}
	}
	
	public List<ItemData> getTagItemsWithCount(String className) throws EndUserException {
		Class<? extends Entity> cls = modelService.getEntityClass(className);
		if (cls==null) {
			throw new IllegalRequestException("Unknown class : "+className);
		}
		Map<String, Integer> properties = modelService.getProperties(Property.KEY_COMMON_TAG, cls,getUserSession());
		List<ItemData> list = Lists.newArrayList();
		for (Entry<String,Integer> entry : properties.entrySet()) {
			ItemData item = new ItemData();
			item.setTitle(entry.getKey());
			item.setValue(entry.getKey());
			item.setKind("tag");
			item.setBadge(entry.getValue().toString());
			item.setIcon("common/folder");
			list.add(item);
		}
		return list;
	}
	
	public Map<String,String> getIpLocation() throws IOException {
		Map<String,String> result = new HashMap<String, String>();
		FileDownload download = new FileDownload();
		File file = File.createTempFile(getClass().getName(), "txt");
		download.download("http://api.hostip.info/get_html.php?ip="+getRequest().getRequest().getRemoteAddr()+"&position=true", file);
		List<?> readLines = IOUtils.readLines(new FileInputStream(file));
		for (Object object : readLines) {
			result.put(object.toString(), object.toString());
		}
		return result;
	}
	
	public void makePubliclyViewable(long id) throws ModelException, SecurityException {
		Entity entity = modelService.get(Entity.class, id, getUserSession());
		securityService.makePublicVisible(entity,getUserSession());
	}
	
	public void makePubliclyHidden(long id) throws ModelException, SecurityException {
		Entity entity = modelService.get(Entity.class, id, getUserSession());
		securityService.makePublicHidden(entity,getUserSession());
	}

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}

	public SecurityService getSecurityService() {
		return securityService;
	}
}
