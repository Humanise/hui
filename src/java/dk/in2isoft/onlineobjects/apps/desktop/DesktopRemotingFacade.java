package dk.in2isoft.onlineobjects.apps.desktop;

import java.net.MalformedURLException;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.in2igui.data.KeyboardNavigatorItem;
import dk.in2isoft.onlineobjects.apps.community.remoting.InternetAddressInfo;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;

public class DesktopRemotingFacade extends AbstractRemotingFacade {
	
	public DesktopRemotingFacade() {
		super();
	}

	public List<Entity> find(String query) throws EndUserException {
		List<Entity> entities = modelService.list(new Query<Entity>(Entity.class).withWords(query).withPrivileged(getUserSession()));
		return entities;
	}
	
	public Window getEntityWindow(Long id) {
		try {
			Entity entity = modelService.get(Entity.class,id);
			return new EntityWindow(entity);
		} catch (ModelException e) {
			return null;
		}
	}
	
	public InternetAddressInfo analyzeURL(String url) throws MalformedURLException {
		InternetAddressInfo info = new InternetAddressInfo();
		HTMLDocument doc = new HTMLDocument(url);
		info.setName(doc.getTitle());
		info.setAddress(url);
		info.setDescription(StringUtils.abbreviate(doc.getText(), 500));
		return info;
	}
	
	public List<KeyboardNavigatorItem> complete(String text) {
		Query<InternetAddress> query = new Query<InternetAddress>(InternetAddress.class).withPrivileged(getUserSession()).withWords(text);
		query.withPaging(0, 30);
		SearchResult<InternetAddress> result = modelService.search(query);
		
		List<InternetAddress> addresses = result.getList();
		List<KeyboardNavigatorItem> items = Lists.newArrayList();
		for (InternetAddress address : addresses) {
			KeyboardNavigatorItem item = new KeyboardNavigatorItem();
			item.setText(address.getName());
			item.setData(address);
			items.add(item);
		}
		return items;
	}
	
	public void saveInternetAddress(InternetAddressInfo info) throws ModelException, SecurityException {
		InternetAddress address;
		if (info.getId()!=null) {
			address = modelService.get(InternetAddress.class, info.getId());
		} else {
			address = new InternetAddress();
		}
		address.setAddress(info.getAddress());
		address.setName(info.getName());
		address.overrideFirstProperty(Property.KEY_COMMON_DESCRIPTION, info.getDescription());
		address.overrideProperties(Property.KEY_COMMON_TAG, info.getTags());
		modelService.createOrUpdateItem(address, getUserSession());
	}
}
