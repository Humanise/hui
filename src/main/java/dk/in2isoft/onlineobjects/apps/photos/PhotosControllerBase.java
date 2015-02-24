package dk.in2isoft.onlineobjects.apps.photos;

import java.util.List;
import java.util.Locale;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.modules.images.ImageGalleryService;
import dk.in2isoft.onlineobjects.services.ImportService;
import dk.in2isoft.onlineobjects.ui.Blend;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class PhotosControllerBase extends ApplicationController {

	protected ImageService imageService;
	protected ImageGalleryService imageGalleryService;
	protected SecurityService securityService;
	protected ImportService importService;

	protected static Blend publicStyle;
	protected static Blend privateStyle;
	protected static Blend publicScript;
	protected static Blend privateScript;
	
	static {
		publicStyle = new Blend("photos_public_style");
		publicStyle.addBasicCSS();
		publicStyle.addPath("hui","css","imageviewer.css");
		publicStyle.addPath("hui","css","box.css");
		publicStyle.addCoreCSS("oo_navigator.css");
		publicStyle.addCoreCSS("oo_thumbnail.css");
		publicStyle.addCoreCSS("oo_list.css");
		publicStyle.addCoreCSS("oo_rendering.css");
		publicStyle.addCoreCSS("oo_splitleft.css");
		publicStyle.addCoreCSS("oo_gallery.css");
		publicStyle.addCoreCSS("oo_words.css");
		publicStyle.addCoreCSS("oo_map.css");
		publicStyle.addCoreCSS("oo_photoviewer.css");
		publicStyle.addCoreCSS("oo_masonry.css");
		publicStyle.addPath("WEB-INF","apps","photos","web","style","css","style.css");
		publicStyle.addPath("WEB-INF","apps","photos","web","style","css","photos_front.css");
		publicStyle.addPath("WEB-INF","apps","photos","web","style","css","photos_controller.css");
		publicStyle.addPath("WEB-INF","apps","photos","web","style","css","photos_photo.css");
		publicStyle.addPath("WEB-INF","apps","photos","web","style","css","photos_gallery.css");
		publicStyle.addPath("WEB-INF","apps","photos","web","style","css","photos_profile.css");
		publicStyle.addPath("WEB-INF","apps","photos","web","style","css","photos_user.css");
		publicStyle.addPath("WEB-INF","apps","photos","web","style","css","photos_layout.css");
		publicStyle.addPath("WEB-INF","apps","photos","web","style","css","photos_adaption.css");
		publicStyle.addPath("WEB-INF","apps","photos","web","style","css","photos_sidebar.css");
		
		privateStyle = new Blend("photos_private_style");
		privateStyle.addPath("hui","css","list.css");
		privateStyle.addPath("hui","css","locationfield.css");
		privateStyle.addPath("hui","css","searchfield.css");
		privateStyle.addPath("hui","css","dropdown.css");
		privateStyle.addPath("hui","css","window.css");
		privateStyle.addPath("hui","css","overflow.css");
		privateStyle.addPath("hui","css","gallery.css");
		privateStyle.addHUICSS("overflow.css");
		privateStyle.addPath("hui","css","bar.css");
		privateStyle.addPath("hui","css","overlay.css");
		privateStyle.addPath("hui","css","pages.css");

		publicScript = new Blend("photos_public_script");
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
		publicScript.addPath("WEB-INF","core","web","js","oo_topbar.js");
		publicScript.addPath("WEB-INF","core","web","js","oo_gallery.js");
		publicScript.addPath("WEB-INF","core","web","js","oo_map.js");
		publicScript.addPath("WEB-INF","core","web","js","oo_photoviewer.js");
		publicScript.addPath("WEB-INF","core","web","js","oo_masonry.js");
		publicScript.addPath("WEB-INF","apps","photos","web","style","js","photo_view.js");
		publicScript.addPath("WEB-INF","apps","photos","web","style","js","gallery_view.js");
		publicScript.addPath("WEB-INF","apps","photos","web","style","js","layout_view.js");
		
		privateScript = new Blend("photos_private_script");
		privateScript.addPath("hui","js","hui_color.js");
		privateScript.addPath("hui","js","hui_require.js");
		privateScript.addPath("hui","js","Checkbox.js");
		privateScript.addPath("hui","js","Source.js");
		privateScript.addPath("hui","js","List.js");
		privateScript.addPath("hui","js","Overflow.js");
		privateScript.addPath("hui","js","Gallery.js");
		privateScript.addPath("hui","js","LocationField.js");
		privateScript.addPath("hui","js","LocationPicker.js");
		privateScript.addPath("hui","js","SearchField.js");
		privateScript.addPath("hui","js","DropDown.js");
		privateScript.addPath("hui","js","Window.js");
		privateScript.addPath("hui","js","Input.js");
		privateScript.addPath("hui","js","DragDrop.js");
		privateScript.addPath("hui","js","Overlay.js");
		privateScript.addPath("hui","js","Pages.js");
		privateScript.addPath("hui","js","Drawing.js");
		privateScript.addPath("hui","js","ProgressIndicator.js");
		privateScript.addPath("hui","js","NumberValidator.js");
		privateScript.addPath("WEB-INF","core","web","js","oo_inlineeditor.js");
		privateScript.addPath("WEB-INF","core","web","js","oo_permissions.js");
		privateScript.addPath("WEB-INF","core","web","js","oo_finder.js");
		privateScript.addPath("WEB-INF","core","web","js","oo_wordfinder.js");
		privateScript.addPath("WEB-INF","core","web","js","oo_words.js");

	}

	public PhotosControllerBase() {
		super("photos");
		addJsfMatcher("/", "front.xhtml");
		addJsfMatcher("/<language>", "front.xhtml");
		addJsfMatcher("/<language>/photo/<integer>.html", "photo.xhtml");
		addJsfMatcher("/<language>/users/<username>", "user.xhtml");
		addJsfMatcher("/<language>/gallery/<integer>", "gallery.xhtml");
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
	
	// Wiring...
	
	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
	
	public void setImportService(ImportService importService) {
		this.importService = importService;
	}
	
	public void setImageGalleryService(ImageGalleryService imageGalleryService) {
		this.imageGalleryService = imageGalleryService;
	}
}