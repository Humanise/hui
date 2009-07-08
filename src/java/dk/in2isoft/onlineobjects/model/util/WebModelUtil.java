package dk.in2isoft.onlineobjects.model.util;

import java.util.List;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Priviledged;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.WebNode;
import dk.in2isoft.onlineobjects.model.WebPage;
import dk.in2isoft.onlineobjects.model.WebSite;
import dk.in2isoft.onlineobjects.publishing.DocumentBuilder;

public class WebModelUtil {
	
	public static WebPage getWebSiteFrontPage(WebSite site) throws ModelException {
		ModelService model = Core.getInstance().getModel();
		WebPage page = null;
		WebNode node = model.getChild(site, WebNode.class);
		if (node!=null) {
			page = model.getChild(node, WebPage.class);
		}
		return page;
	}

	public static WebSite getUsersWebSite(User user) throws ModelException {
		ModelService model = Core.getInstance().getModel();
		WebSite site = model.getChild(user, WebSite.class);
		return site;
	}
	
	public static WebSite getWebSiteOfPage(WebPage page) throws ModelException {
		ModelService model = Core.getInstance().getModel();
		WebNode node = model.getParent(page, WebNode.class);
		if (node==null) {
			return null;
		}
		WebSite site = model.getParent(node, WebSite.class);
		return site;
	}

	public static WebPage getPageForWebNode(long id) throws ModelException {
		WebPage page = null;
		ModelService model = Core.getInstance().getModel();
		WebNode node = model.get(WebNode.class, id);
		if (node!=null) {
			page = model.getChild(node, WebPage.class);
		}
		return page;
	}
	
	public static long createWebPageOnSite(long webSiteId, Class<?> clazz, Priviledged priviledged) throws EndUserException {
		ModelService model = Core.getInstance().getModel();
		WebSite site = model.get(WebSite.class, webSiteId);
		
		// Create a web page
		WebPage page = new WebPage();
		page.setName("Min side");
		page.setTitle("Min side");
		model.createItem(page,priviledged);
		
		// Create a web node
		WebNode node = new WebNode();
		node.setName("Min side");
		model.createItem(node,priviledged);
		
		// Update positions of nodes
		List<Relation> relations = model.getChildRelations(site,WebNode.class);
		int position = 1;
		for (Relation relation : relations) {
			relation.setPosition(position);
			model.updateItem(relation, priviledged);
			position++;
		}
		
		// Create a relation between node and page
		Relation nodePageRelation = new Relation(node,page);
		nodePageRelation.setPosition(1);
		model.createItem(nodePageRelation,priviledged);
		
		// Create a relation between site and node
		Relation siteNode2Relation = new Relation(site,node);
		model.createItem(siteNode2Relation,priviledged);
		
		Entity document = DocumentBuilder.getBuilder(clazz).create(priviledged); 
		
		// Set gallery as content of page
		Relation pageDocumentRelation = new Relation(page,document);
		pageDocumentRelation.setKind(Relation.KIND_WEB_CONTENT);
		model.createItem(pageDocumentRelation,priviledged);
		
		return node.getId();
		
	}
	
	public static void deleteWebPage(long pageId,Priviledged privileged) throws EndUserException {
		ModelService model = Core.getInstance().getModel();
		WebPage page = (WebPage) model.get(WebPage.class, pageId);
		if (page == null) {
			throw new EndUserException("The page does not exist");
		}

		// Delete Nodes
		List<WebNode> nodes = model.getParents(page, WebNode.class);
		for (WebNode node : nodes) {
			model.deleteEntity(node,privileged);
		}

		// Delete page content
		List<Entity> contents = model.getChildren(page, Relation.KIND_WEB_CONTENT, privileged);
		for (Entity content : contents) {
			model.deleteEntity(content, privileged);
		}
		
		model.deleteEntity(page,privileged);
	}
}