package dk.in2isoft.onlineobjects.apps.people;

import java.util.List;
import java.util.Locale;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.apps.community.CommunityDAO;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.ui.Blend;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class PeopleControllerBase extends ApplicationController {

	protected ImageService imageService;
	protected SecurityService securityService;
	protected CommunityDAO communityDAO;

	protected static Blend publicStyle;
	protected static Blend privateStyle;
	protected static Blend publicScript;
	protected static Blend privateScript;
	
	static {
		publicStyle = new Blend("people_public_style");
		publicStyle.addBasicCSS();
		publicStyle.addHUICSS("imageviewer.css");
		publicStyle.addHUICSS("box.css");
		publicStyle.addCoreCSS("oo_navigator.css");
		publicStyle.addCoreCSS("oo_thumbnail.css");
		publicStyle.addCoreCSS("oo_list.css");
		publicStyle.addCoreCSS("oo_rendering.css");
		publicStyle.addCoreCSS("oo_splitleft.css");
		publicStyle.addCoreCSS("oo_gallery.css");
		publicStyle.addPath("WEB-INF","apps","people","web","style","css","people_person.css");
		publicStyle.addPath("WEB-INF","apps","people","web","style","css","people_list.css");
		
		privateStyle = new Blend("people_private_style");
		privateStyle.addPath("hui","css","upload.css");
		privateStyle.addPath("hui","css","dropdown.css");
		privateStyle.addPath("hui","css","tokenfield.css");

		publicScript = new Blend("people_public_script");
		publicScript.addPath("hui","js","hui.js");
		publicScript.addPath("hui","js","hui_animation.js");
		publicScript.addPath("hui","js","ui.js");
		publicScript.addPath("hui","js","Button.js");
		publicScript.addPath("hui","js","BoundPanel.js");
		publicScript.addPath("hui","js","TextField.js");
		publicScript.addPath("hui","js","Formula.js");
		publicScript.addPath("hui","js","ImageViewer.js");
		publicScript.addPath("hui","js","Box.js");
		publicScript.addPath("WEB-INF","core","web","js","onlineobjects.js");
		publicScript.addPath("WEB-INF","core","web","js","map.js");
		
		privateScript = new Blend("people_private_script");
		privateScript.addPath("hui","js","hui_color.js");
		privateScript.addPath("hui","js","Upload.js");
		privateScript.addPath("hui","js","ObjectList.js");
		privateScript.addPath("hui","js","Input.js");
		privateScript.addPath("hui","js","DropDown.js");
		privateScript.addPath("hui","js","TokenField.js");
		privateScript.addPath("hui","js","Overlay.js");
		privateScript.addPath("WEB-INF","apps","people","web","style","js","people_person.js");

	}

	public PeopleControllerBase() {
		super("people");
		addJsfMatcher("/", "front.xhtml");
		addJsfMatcher("/<language>", "front.xhtml");
		addJsfMatcher("/<username>", "user.xhtml");
		addJsfMatcher("/<language>/<username>", "user.xhtml");
	}
		
	public List<Locale> getLocales() {
		return Lists.newArrayList(new Locale("en"),new Locale("da"));
	}

	@Override
	public String getLanguage(Request request) {
		String[] path = request.getLocalPath();
		if (path.length>0) {
			if ("en".equals(path[0]) || "da".equals(path[0])) {
				return path[0];
			}
		}
		return super.getLanguage(request);
	}

	protected Image getImage(long id, Privileged privileged) throws ModelException, ContentNotFoundException {
		Image image = modelService.get(Image.class, id,privileged);
		if (image==null) {
			throw new ContentNotFoundException("The image was not found");
		}
		return image;
	}
	
	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
	
	public void setCommunityDAO(CommunityDAO communityDAO) {
		this.communityDAO = communityDAO;
	}
}