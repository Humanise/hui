package dk.in2isoft.onlineobjects.apps.desktop;

import java.util.List;
import java.util.Locale;

import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.apps.ApplicationSession;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.services.ImportService;
import dk.in2isoft.onlineobjects.ui.Blend;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public abstract class DesktopControlerBase extends ApplicationController {

	protected ImportService importService;
	protected ImageService imageService;
	protected HTMLService htmlService;
	protected static final Logger log = Logger.getLogger(DesktopController.class);

	protected static final Blend publicScript;
	protected static final Blend publicStyle;
	
	static {

		publicScript = new Blend("desktop_public_script");
		publicScript.addPath("hui","js","hui.js");
		publicScript.addPath("hui","js","hui_animation.js");
		publicScript.addPath("hui","js","hui_color.js");
		publicScript.addPath("hui","js","ui.js");
		publicScript.addPath("hui","js","Input.js");
		publicScript.addPath("hui","js","Button.js");
		publicScript.addPath("hui","js","BoundPanel.js");
		publicScript.addPath("hui","js","TextField.js");
		publicScript.addPath("hui","js","Formula.js");
		publicScript.addPath("hui","js","Drawing.js");
		publicScript.addPath("hui","js","Source.js");
		publicScript.addPath("hui","js","Overlay.js");
		publicScript.addPath("hui","js","List.js");
		publicScript.addPath("hui","js","ProgressIndicator.js");
		publicScript.addPath("WEB-INF","core","web","js","onlineobjects.js");
		publicScript.addPath("WEB-INF","core","web","js","oo_topbar.js");
		publicScript.addPath("WEB-INF","apps","desktop","web","js","ctrl.js");
		publicScript.addPath("WEB-INF","apps","desktop","web","js","desktop.js");
		publicScript.addPath("WEB-INF","apps","desktop","web","js","desktop_searchbar.js");
		publicScript.addPath("WEB-INF","apps","desktop","web","js","desktop_list.js");
		publicScript.addPath("WEB-INF","apps","desktop","web","js","desktop_widget_bookmarks.js");
		publicScript.addPath("WEB-INF","apps","desktop","web","js","desktop_widget_image.js");

	
		publicStyle = new Blend("desktop_public_style");
		publicStyle.addCoreCSS("oo_font.css");
		publicStyle.addCoreCSS("oo_icon.css");
		publicStyle.addPath("hui","css","curtain.css");
		publicStyle.addPath("hui","css","button.css");
		publicStyle.addPath("hui","css","boundpanel.css");
		publicStyle.addPath("hui","css","checkbox.css");
		publicStyle.addPath("hui","css","formula.css");
		publicStyle.addPath("hui","css","message.css");
		publicStyle.addPath("hui","css","icon.css");
		publicStyle.addPath("hui","css","list.css");
		publicStyle.addPath("hui","css","overlay.css");
		publicStyle.addPath("WEB-INF","core","web","css","oo_topbar.css");
		publicStyle.addPath("WEB-INF","apps","desktop","web","css","desktop.css");
		publicStyle.addPath("WEB-INF","apps","desktop","web","css","dock.css");
		publicStyle.addPath("WEB-INF","apps","desktop","web","css","widget.css");
		publicStyle.addPath("WEB-INF","apps","desktop","web","css","desktop_searchbar.css");
		publicStyle.addPath("WEB-INF","apps","desktop","web","css","desktop_list.css");
		publicStyle.addPath("WEB-INF","apps","desktop","web","css","desktop_widget_image.css");

	}

	
	public DesktopControlerBase() {
		super("desktop");
		addJsfMatcher("/", "front.xhtml");
	}

	public List<Locale> getLocales() {
		return null;
	}

	@Override
	public ApplicationSession createToolSession() {
		return new DesktopSession();
	}

	public void setImportService(ImportService importService) {
		this.importService = importService;
	}

	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}

	public void setHtmlService(HTMLService htmlService) {
		this.htmlService = htmlService;
	}

}