package dk.in2isoft.onlineobjects.apps.community;

import java.io.File;
import java.io.IOException;

import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.in2igui.FileBasedInterface;
import dk.in2isoft.in2igui.Interface;
import dk.in2isoft.onlineobjects.ui.Request;

public class PrivateSpaceController {

	private CommunityController communityController;
	private File persons;
	private File images;
	private File settings;
	private File bookmarks;
	
	protected void displayPersons(Request request) throws IOException {
		if (persons==null) {
			persons = communityController.getFile("web","gui","private","persons.gui.xml");
		}
		Interface ui = new FileBasedInterface(persons);
		ui.render(request.getRequest(),request.getResponse());
	}

	public void displayImages(Request request) throws IOException {
		if (images==null) {
			images = communityController.getFile("web","gui","private","images.gui.xml");		
		}
		Interface ui = new FileBasedInterface(images);
		ui.render(request.getRequest(),request.getResponse());
	}

	public void displayBookmarks(Request request) throws IOException {
		if (bookmarks==null) {
			bookmarks = communityController.getFile("web","gui","private","bookmarks.gui.xml");
		}
		Interface ui = new FileBasedInterface(bookmarks);
		ui.render(request.getRequest(),request.getResponse());
	}

	public void displaySettings(Request request) throws IOException {
		if (settings==null) {
			settings = communityController.getFile("web","gui","private","settings.gui.xml");
		}
		Interface ui = new FileBasedInterface(settings);
		ui.render(request.getRequest(),request.getResponse());
	}

	public void setCommunityController(CommunityController communityController) {
		this.communityController = communityController;
	}

	public CommunityController getCommunityController() {
		return communityController;
	}
}
