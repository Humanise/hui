package dk.in2isoft.onlineobjects.apps.community;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.apache.log4j.Logger;

import dk.in2isoft.in2igui.data.TextFieldData;
import dk.in2isoft.in2igui.data.WidgetData;
import dk.in2isoft.onlineobjects.apps.ApplicationSession;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelFacade;
import dk.in2isoft.onlineobjects.core.ModelQuery;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.WebNode;
import dk.in2isoft.onlineobjects.model.WebPage;
import dk.in2isoft.onlineobjects.model.WebSite;
import dk.in2isoft.onlineobjects.model.util.WebModelUtil;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;
import dk.in2isoft.onlineobjects.ui.AsynchronousProcessDescriptor;

public class RemotingFacade extends AbstractRemotingFacade {
	
	private static Logger log = Logger.getLogger(RemotingFacade.class);

	public boolean signUp(String username, String password) 
	throws EndUserException {
		if (username==null || username.length()==0) {
			throw new EndUserException("Username is null");
		}
		if (password==null || password.length()==0) {
			throw new EndUserException("Password is null");
		}
		ModelFacade model = getModel();
		User existing = model.getUser(username);
		if (existing==null) {
			
			// Create a user
			User user = new User();
			user.setUsername(username);
			user.setPassword(password);
			model.saveItem(user,getUserSession());
			
			Core.getInstance().getSecurity().changeUser(getUserSession(), username, password);
			
			// Create a person
			Person person = new Person();
			person.setName(username);
			model.saveItem(person, getUserSession());
			
			// Create relation between user and person
			Relation userPersonRelation = new Relation(user,person);
			userPersonRelation.setKind(Relation.KIND_SYSTEM_USER_SELF);
			model.saveItem(userPersonRelation, getUserSession());
			
			// Create a website
			WebSite site = new WebSite();
			site.setName(username);
			model.saveItem(site,getUserSession());
			
			// Create relation between user and website
			Relation userSiteRelation = new Relation(user,site);
			model.saveItem(userSiteRelation,getUserSession());
			
			WebModelUtil.createWebPageOnSite(site.getId(), getUserSession());
			
			Core.getInstance().getSecurity().changeUser(getUserSession(), username, password);
			return true;
		} else {
			throw new EndUserException("User allready exists");
		}
	}
	
	public long createWebPage(long webSiteId) throws EndUserException {
		return WebModelUtil.createWebPageOnSite(webSiteId, getUserSession());
	}
	
	public boolean deleteWebPage(long id) throws EndUserException {
		ModelFacade model = getModel();
		WebPage page = (WebPage) model.loadEntity(WebPage.class, id);
		if (page==null) {
			throw new EndUserException("The page does not exist");
		}
		List<Entity> nodes = model.getSuperEntities(page, WebNode.class);
		for (Entity node : nodes) {
			model.deleteEntity(node);
		}
		model.deleteEntity(page);
		return true;
	}
	
	public boolean updateWebNode(long id,String name) throws EndUserException {
		ModelFacade model = getModel();
		WebNode node = (WebNode) model.loadEntity(WebNode.class, id);
		node.setName(name);
		model.updateItem(node, getUserSession());
		return true;
	}
	
	public AsynchronousProcessDescriptor getProcess(String key) 
	throws Exception {
		try {
			ApplicationSession toolSession = getUserSession().getToolSession("community");
			log.debug(toolSession);
			return toolSession.getAsynchronousProcessDescriptor(key);
		} catch (Exception e) {
			log.debug(e);
			throw e;
		}
	}

	public List<Entity> search(String query) {
		ModelQuery mq = new ModelQuery();
		mq.setWords(query.split(" "));
		List<Entity> entities = Core.getInstance().getModel().searchEntities(mq);
		return entities;
	}
	
	public void changePageTemplate(long pageId,String template) throws EndUserException {
		ModelFacade model = getModel();
		WebPage page = (WebPage) model.loadEntity(WebPage.class, pageId);
		page.overrideFirstProperty(WebPage.PROPERTY_TEMPLATE,template);
		model.updateItem(page,getUserSession());
	}
	
	public Collection<WidgetData> getProfileGuiData() throws EndUserException {
		getUserSession().getUser();
		List<Entity> persons = getModel().getSubEntities(getUserSession().getUser(), Person.class);
		if (persons.size()>0) {
			Person person = (Person) persons.get(0);
			Collection<WidgetData> list = new ArrayList<WidgetData>();
			list.add(new TextFieldData("namePrefix",person.getNamePrefix()));
			list.add(new TextFieldData("givenName",person.getGivenName()));
			list.add(new TextFieldData("familyName",person.getFamilyName()));
			list.add(new TextFieldData("additionalName",person.getAdditionalName()));
			list.add(new TextFieldData("nameSuffix",person.getNameSuffix()));
			return list;
		} else {
			throw new EndUserException("The user does not have a person!");
		}
	}
	
	public Person getUsersMainPerson() throws EndUserException {
		getUserSession().getUser();
		List<Entity> persons = getModel().getSubEntities(getUserSession().getUser(), Person.class);
		if (persons.size()>0) {
			return (Person) persons.get(0);
		} else {
			throw new EndUserException("The user does not have a person!");
		}
	}
	
	public void updateUsersMainPerson(Person dummy) throws EndUserException {
		Person person = getUsersMainPerson();
		person.setGivenName(dummy.getGivenName());
		person.setFamilyName(dummy.getFamilyName());
		person.setNamePrefix(dummy.getNamePrefix());
		person.setNameSuffix(dummy.getNameSuffix());
		getModel().saveItem(person, getUserSession());
	}
}
