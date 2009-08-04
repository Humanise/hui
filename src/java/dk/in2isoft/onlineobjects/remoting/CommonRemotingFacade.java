package dk.in2isoft.onlineobjects.remoting;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.IOUtils;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.http.FileDownload;
import dk.in2isoft.in2igui.data.ItemData;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;

public class CommonRemotingFacade extends AbstractRemotingFacade {

	public Entity getEntity(long id) throws ModelException {
		return modelService.get(Entity.class, id);
	}
	
	public void deleteEntity(long id) throws ModelException, SecurityException {
		Entity entity = modelService.get(Entity.class, id);
		modelService.deleteEntity(entity, getUserSession());
	}
	
	public Collection<ItemData> getClasses() {
		Collection<Class<?>> classes = modelService.getEntityClasses();
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
	
	public Map<String,String> getIpLocation() throws IOException {
		Map<String,String> result = new HashMap<String, String>();
		FileDownload download = new FileDownload();
		File file = File.createTempFile(getClass().getName(), "txt");
		download.download("http://api.hostip.info/get_html.php?ip=62.66.229.154&position=true", file);
		List readLines = IOUtils.readLines(new FileInputStream(file));
		
		return result;
	}
}
