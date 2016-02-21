package dk.in2isoft.onlineobjects.apps.tools;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.in2igui.FileBasedInterface;
import dk.in2isoft.in2igui.data.ItemData;
import dk.in2isoft.in2igui.data.ListData;
import dk.in2isoft.in2igui.data.ListDataRow;
import dk.in2isoft.in2igui.data.ListObjects;
import dk.in2isoft.in2igui.data.ListWriter;
import dk.in2isoft.onlineobjects.apps.community.remoting.InternetAddressInfo;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.PhoneNumber;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.images.ImageImporter;
import dk.in2isoft.onlineobjects.modules.importing.DataImporter;
import dk.in2isoft.onlineobjects.modules.language.WordByInternetAddressQuery;
import dk.in2isoft.onlineobjects.ui.Request;


public class ToolsController extends ToolsControllerBase {

	public List<Locale> getLocales() {
		return null;
	}

	@Override
	public void unknownRequest(Request request) throws IOException, EndUserException {
		String[] localPath = request.getLocalPath();
		if (localPath.length==0) {
			request.getResponse().sendRedirect("images/");
		} else if (request.testLocalPathFull("images")) {
			FileBasedInterface ui = new FileBasedInterface(getFile("web","images.gui.xml"));
			ui.setParameter("username", request.getSession().getUser().getUsername());
			ui.render(request.getRequest(), request.getResponse());
		} else if (request.testLocalPathFull("persons")) {
			FileBasedInterface ui = new FileBasedInterface(getFile("web","persons.gui.xml"));
			ui.setParameter("username", request.getSession().getUser().getUsername());
			ui.render(request.getRequest(), request.getResponse());
		} else if (request.testLocalPathFull("bookmarks")) {
			FileBasedInterface ui = new FileBasedInterface(getFile("web","bookmarks.gui.xml"));
			ui.setParameter("username", request.getSession().getUser().getUsername());
			ui.render(request.getRequest(), request.getResponse());
		} else if (request.testLocalPathFull("integration")) {
			FileBasedInterface ui = new FileBasedInterface(getFile("web","integration.gui.xml"));
			ui.setParameter("username", request.getSession().getUser().getUsername());
			ui.render(request.getRequest(), request.getResponse());
		} else {
			super.unknownRequest(request);
		}
	}

	@Path(start="uploadImage")
	public void importImage(Request request) throws IOException, EndUserException {
		DataImporter dataImporter = importService.createImporter();
		dataImporter.setListener(new ImageImporter(modelService,imageService));
		dataImporter.importMultipart(this, request);
	}
	
	@Path
	public ListObjects listImages(Request request) throws EndUserException {
		String text = request.getString("text");
		String tag = request.getString("tag");
		ListObjects list = new ListObjects();
		Query<Image> query = new Query<Image>(Image.class).withPrivileged(request.getSession());
		query.withWords(text);
		if (Strings.isNotBlank(tag)) {
			query.withCustomProperty(Property.KEY_COMMON_TAG, tag);
		}
		List<Image> persons = modelService.list(query);
		
		for (Image image : persons) {
			ListDataRow row = new ListDataRow();
			row.addColumn("id", image.getId());
			row.addColumn("name", image.getName());
			row.addColumn("size", image.getWidth()+"x"+image.getHeight());
			row.addColumn("width", image.getWidth());
			row.addColumn("height", image.getHeight());
			list.addRow(row);
		}
		return list;
	}
	
	@Path
	public void listPersons(Request request) throws EndUserException, IOException {
		String text = request.getString("text");
		UserSession session = request.getSession();
		Query<Person> query = new Query<Person>(Person.class).withPrivileged(session);
		query.withWords(text);
		List<Person> persons = modelService.list(query);
		
		ListWriter out = new ListWriter(request);
		out.startList();
		out.startHeaders().header("Name").header("Addresses").endHeaders();
		for (Person person : persons) {
			out.startRow().withId(person.getId());
			out.startCell().text(person.getFullName()).endCell();
			Long addressCount = modelService.count(Query.after(InternetAddress.class).to(person).withPrivileged(session));
			out.startCell().text(addressCount).endCell();
			out.endRow();
		}
		out.endList();
	}

	@Path
	public Map<String,Object> loadPerson(Request request) throws ModelException, ContentNotFoundException, IllegalRequestException {
		Long id = request.getId();
		
		Map<String,Object> data = new HashMap<String, Object>();
		Privileged privileged = request.getSession();
		Person person = modelService.getRequired(Person.class, id, privileged);
		data.put("person", person);
		List<EmailAddress> emails = modelService.getChildren(person, EmailAddress.class, privileged);
		data.put("emails", emails);
		List<PhoneNumber> phones = modelService.getChildren(person, PhoneNumber.class, privileged);
		data.put("phones", phones);
		return data;
	}
	
	@Path
	public void deletePerson(Request request) throws ModelException, ContentNotFoundException, SecurityException, IllegalRequestException {
		Long id = request.getId();
		Person person = modelService.getRequired(Person.class, id, request.getSession());
		modelService.deleteEntity(person, request.getSession());
	}
	
	@Path
	public ListData listPrivateBookmarks(Request request) throws EndUserException {
		String search = request.getString("search");
		String tag = request.getString("tag");
		Long wordId = request.getLong("word",null);
		int page = request.getInt("page");
		Query<InternetAddress> query = new Query<InternetAddress>(InternetAddress.class).withPrivileged(request.getSession()).withWords(search);
		query.withPaging(page, 30);
		if (Strings.isNotBlank(tag)) {
			query.withCustomProperty(Property.KEY_COMMON_TAG, tag);
		}
		if (wordId!=null) {
			Word word = modelService.get(Word.class, wordId, request.getSession());
			if (word!=null) {
				query.to(word);
			}
		}
		SearchResult<InternetAddress> result = modelService.search(query);
		
		List<InternetAddress> addresses = result.getList();
		ListData list = new ListData();
		list.setWindow(result.getTotalCount(), 30, page);
		list.addHeader("Titel");
		list.addHeader("Adresse");
		for (InternetAddress address : addresses) {
			Map<String,String> data = Maps.newHashMap();
			data.put("address", address.getAddress());
			list.newRow(address.getId(), "internetAddress", data);
			list.addCell(address.getName(),"common/internet");
			list.addCell(address.getAddress(),"monochrome/globe");
		}
		return list;
	}
	
	@Path
	public InternetAddressInfo getInternetAddress(Request request) throws ModelException {
		Long id = request.getLong("id", null);
		if (id!=null) {
			InternetAddress address = modelService.get(InternetAddress.class, id, request.getSession());
			if (address!=null) {
				InternetAddressInfo info = new InternetAddressInfo();
				info.setId(address.getId());
				info.setName(address.getName());
				info.setAddress(address.getAddress());
				info.setDescription(address.getPropertyValue(Property.KEY_COMMON_DESCRIPTION));
				info.setTags(address.getPropertyValues(Property.KEY_COMMON_TAG));
				return info;
			}
		}
		return null;
	}
	
	@Path
	public void saveInternetAddress(Request request) throws ModelException, SecurityException, IllegalRequestException, ContentNotFoundException {
		InternetAddressInfo info = request.getObject("data", InternetAddressInfo.class);
		if (info==null) {
			throw new IllegalRequestException("Malformed data");
		}
		InternetAddress address;
		if (info.getId()!=null) {
			address = modelService.getRequired(InternetAddress.class, info.getId(), request.getSession());
		} else {
			address = new InternetAddress();
		}
		address.setAddress(info.getAddress());
		address.setName(info.getName());
		address.overrideFirstProperty(Property.KEY_COMMON_DESCRIPTION, info.getDescription());
		address.overrideProperties(Property.KEY_COMMON_TAG, info.getTags());
		modelService.createOrUpdateItem(address, request.getSession());
	}
	
	@Path
	public void addInternetAddress(Request request) throws ModelException, IllegalRequestException {
		try {
			informationService.addInternetAddress(request.getString("url"), request.getSession());			
		} catch (IllegalArgumentException e) {
			throw new IllegalRequestException("Unable to create address");
		}
	}
	
	
	@Path
	public List<ItemData> getImageTags(Request request) throws EndUserException {
		return getTags(Image.class, request);
	}

	@Path
	public List<ItemData> getInternetAddressTagCloud(Request request) throws EndUserException {
		return getTags(InternetAddress.class, request);
	}

	private List<ItemData> getTags(Class<? extends Entity> type, Request request) {
		Map<String, Integer> properties = modelService.getProperties(Property.KEY_COMMON_TAG, type,request.getSession());
		List<ItemData> list = Lists.newArrayList();
		for (Entry<String,Integer> entry : properties.entrySet()) {
			ItemData item = new ItemData();
			item.setText(entry.getKey());
			item.setValue(entry.getKey());
			item.setKind("tag");
			item.setBadge(entry.getValue().toString());
			item.setIcon("common/folder");
			list.add(item);
		}
		return list;
	}

	@Path
	public List<ItemData> getInternetAddressWordCloud(Request request) throws ModelException {
		WordByInternetAddressQuery query = new WordByInternetAddressQuery(request.getSession());
		return modelService.list(query);
	}
	
	@Override
	public boolean isAllowed(Request request) {
		return request.isLoggedIn();
	}
}
