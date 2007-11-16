package dk.in2isoft.onlineobjects.model.util;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelFacade;
import dk.in2isoft.onlineobjects.core.Priviledged;
import dk.in2isoft.onlineobjects.model.ImageGallery;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.WebNode;
import dk.in2isoft.onlineobjects.model.WebPage;
import dk.in2isoft.onlineobjects.model.WebSite;

public class WebModelUtil {
	
	public static WebPage getWebSiteFrontPage(WebSite site) throws ModelException {
		ModelFacade model = Core.getInstance().getModel();
		WebPage page = null;
		WebNode node = (WebNode) model.getFirstSubRelation(site, WebNode.TYPE, WebNode.class);
		if (node!=null) {
			page = (WebPage) model.getFirstSubRelation(node, WebPage.TYPE, WebPage.class);
		}
		return page;
	}

	public static WebSite getUsersWebSite(User user) throws ModelException {
		ModelFacade model = Core.getInstance().getModel();
		WebSite site = (WebSite) model.getFirstSubRelation(user, WebSite.TYPE, WebSite.class);
		return site;
	}
	
	public static WebSite getWebSiteOfPage(WebPage page) throws ModelException {
		ModelFacade model = Core.getInstance().getModel();
		WebNode node = (WebNode) model.getFirstSuperRelation(page, WebNode.TYPE, WebNode.class);
		WebSite site = (WebSite) model.getFirstSuperRelation(node, WebSite.TYPE, WebSite.class);
		return site;
	}

	public static WebPage getPageForWebNode(long id) throws ModelException {
		WebPage page = null;
		ModelFacade model = Core.getInstance().getModel();
		WebNode node = (WebNode) model.loadEntity(WebNode.class, id);
		if (node!=null) {
			page = (WebPage) model.getFirstSubRelation(node, WebPage.TYPE, WebPage.class);
		}
		return page;
	}
	
	public static long createWebPageOnSite(long webSiteId, Priviledged priviledged) throws ModelException {
		ModelFacade model = Core.getInstance().getModel();
		WebSite site = (WebSite) model.loadEntity(WebSite.class, webSiteId);
		
		// Create a web page
		WebPage page = new WebPage();
		page.setName("My new page");
		page.setTitle("My new page");
		model.saveItem(page,priviledged);
		
		// Create a web node
		WebNode node = new WebNode();
		node.setName("My new page");
		model.saveItem(node,priviledged);
		
		// Create a relation between node and page
		Relation nodePageRelation = new Relation(node,page);
		model.saveItem(nodePageRelation,priviledged);
		
		// Create a relation between site and node
		Relation siteNode2Relation = new Relation(site,node);
		model.saveItem(siteNode2Relation,priviledged);

		// Create an image gallery
		ImageGallery gallery = new ImageGallery();
		gallery.setName("My new image gallery");
		model.saveItem(gallery,priviledged);
		
		// Set gallery as content of page
		Relation pageGalleryRelation = new Relation(page,gallery);
		pageGalleryRelation.setKind(Relation.KIND_WEB_CONTENT);
		model.saveItem(pageGalleryRelation,priviledged);
		return node.getId();
		
	}
}