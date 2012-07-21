package dk.in2isoft.onlineobjects.apps.community;

import java.io.File;
import java.io.IOException;

import dk.in2isoft.in2igui.FileBasedInterface;
import dk.in2isoft.in2igui.Interface;
import dk.in2isoft.onlineobjects.ui.Request;

public class PrivateSpaceController {

	private CommunityController communityController;
	private File persons;
	private File images;
	private File settings;
	private File bookmarks;
	private File integration;
	private File bookmarksAlone;
	
	protected void displayPersons(Request request) throws IOException {
		if (persons==null) {
			persons = communityController.getFile("web","gui","private","persons.gui.xml");
		}
		Interface ui = new FileBasedInterface(persons);
		ui.setParameter("username", request.getSession().getUser().getUsername());
		ui.render(request.getRequest(),request.getResponse());
	}

	public void displayImages(Request request) throws IOException {
		if (images==null) {
			images = communityController.getFile("web","gui","private","images.gui.xml");		
		}
		Interface ui = new FileBasedInterface(images);
		ui.setParameter("username", request.getSession().getUser().getUsername());
		ui.render(request.getRequest(),request.getResponse());
	}

	public void displayBookmarks(Request request) throws IOException {
		if (bookmarks==null) {
			bookmarks = communityController.getFile("web","gui","private","bookmarks.gui.xml");
		}
		Interface ui = new FileBasedInterface(bookmarks);
		ui.setParameter("username", request.getSession().getUser().getUsername());
		ui.render(request.getRequest(),request.getResponse());
	}

	public void displayBookmarksAlone(Request request) throws IOException {
		if (bookmarksAlone==null) {
			bookmarksAlone = communityController.getFile("web","gui","private","bookmarks_alone.gui.xml");
		}
		Interface ui = new FileBasedInterface(bookmarksAlone);
		ui.setParameter("username", request.getSession().getUser().getUsername());
		ui.render(request.getRequest(),request.getResponse());
	}

	public void displayIntegration(Request request) throws IOException {
		if (integration==null) {
			integration = communityController.getFile("web","gui","private","integration.gui.xml");
		}
		Interface ui = new FileBasedInterface(integration);
		ui.setParameter("username", request.getSession().getUser().getUsername());
		ui.render(request.getRequest(),request.getResponse());
	}

	public void displaySettings(Request request) throws IOException {
		if (settings==null) {
			settings = communityController.getFile("web","gui","private","settings.gui.xml");
		}
		Interface ui = new FileBasedInterface(settings);
		ui.setParameter("username", request.getSession().getUser().getUsername());
		ui.render(request.getRequest(),request.getResponse());
	}

	public void setCommunityController(CommunityController communityController) {
		this.communityController = communityController;
	}

	public CommunityController getCommunityController() {
		return communityController;
	}
}
