package dk.in2isoft.onlineobjects.apps.community;

import java.io.File;
import java.io.IOException;

import dk.in2isoft.in2igui.FileBasedInterface;
import dk.in2isoft.in2igui.Interface;
import dk.in2isoft.onlineobjects.ui.Request;

public class PrivateSpaceController {

	private File persons;
	private File images;
	private File settings;
	private File bookmarks;
	
	public PrivateSpaceController(CommunityController controller) {
		persons = controller.getFile("web","gui","private","persons.gui.xml");
		images = controller.getFile("web","gui","private","images.gui.xml");
		settings = controller.getFile("web","gui","private","settings.gui.xml");
		bookmarks = controller.getFile("web","gui","private","bookmarks.gui.xml");
	}
	
	protected void displayPersons(Request request) throws IOException {
		Interface ui = new FileBasedInterface(persons);
		ui.render(request.getRequest(),request.getResponse());
	}

	public void displayImages(Request request) throws IOException {
		Interface ui = new FileBasedInterface(images);
		ui.render(request.getRequest(),request.getResponse());
	}

	public void displayBookmarks(Request request) throws IOException {
		Interface ui = new FileBasedInterface(bookmarks);
		ui.render(request.getRequest(),request.getResponse());
	}

	public void displaySettings(Request request) throws IOException {
		Interface ui = new FileBasedInterface(settings);
		ui.render(request.getRequest(),request.getResponse());
	}
}
