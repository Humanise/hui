package dk.in2isoft.onlineobjects.apps.photos;

import java.io.IOException;
import java.util.List;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.in2igui.data.ListData;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.HeaderPart;
import dk.in2isoft.onlineobjects.model.HtmlPart;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.ImageGallery;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.importing.DataImporter;
import dk.in2isoft.onlineobjects.modules.importing.ImportListener;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.ScriptWriter;
import dk.in2isoft.onlineobjects.ui.StylesheetWriter;
import dk.in2isoft.onlineobjects.ui.data.SimpleEntityPerspective;
import dk.in2isoft.onlineobjects.util.images.ImageInfo.ImageLocation;


public class PhotosController extends PhotosControllerBase {
	

	@Path(expression="/style.[0-9]+.css")
	public void style(Request request) throws IOException, EndUserException {
		StylesheetWriter writer = new StylesheetWriter(request, configurationService);
		writer.write(publicStyle);
	}

	@Path(expression="/style_private.[0-9]+.css")
	public void stylePrivate(Request request) throws IOException, EndUserException {
		StylesheetWriter writer = new StylesheetWriter(request, configurationService);
		writer.write(privateStyle);
	}

	@Path(expression="/script.[0-9]+.js")
	public void script(Request request) throws IOException, EndUserException {
		ScriptWriter writer = new ScriptWriter(request, configurationService);	
		writer.write(publicScript);
	}

	@Path(expression="/script_private.[0-9]+.js")
	public void scriptPrivate(Request request) throws IOException, EndUserException {
		ScriptWriter writer = new ScriptWriter(request, configurationService);
		writer.write(privateScript);
	}

	@Path(start="updateTitle")
	public void updateImageTitle(Request request) throws ModelException, SecurityException, ContentNotFoundException {
		UserSession session = request.getSession();
		long id = request.getInt("id");
		String title = request.getString("title");
		Image image = getImage(id,session);
		image.setName(title);
		modelService.updateItem(image, session);
	}

	@Path(start="updateDescription")
	public void updateImageDescription(Request request) throws ModelException, SecurityException, ContentNotFoundException {
		UserSession session = request.getSession();
		long id = request.getInt("id");
		String description = request.getString("description");
		Image image = getImage(id,session);
		image.overrideFirstProperty(Image.PROPERTY_DESCRIPTION, description);
		modelService.updateItem(image, session);
	}

	@Path(start="updateLocation")
	public void updateImageLocation(Request request) throws ModelException, SecurityException, ContentNotFoundException {
		UserSession session = request.getSession();
		long id = request.getInt("id");
		ImageLocation location = request.getObject("location", ImageLocation.class);
		Image image = getImage(id,session);
		imageService.updateImageLocation(image, location, session);
	}

	@Path(start="relateWord")
	public void relateWordToImage(Request request) throws ModelException, SecurityException, ContentNotFoundException {
		UserSession session = request.getSession();
		long imageId = request.getInt("image");
		long wordId = request.getInt("word");
		Image image = getImage(imageId,session);
		Word word = modelService.get(Word.class, wordId, session);
		if (word==null) {
			throw new ContentNotFoundException("The word was not found");
		}
		Relation relation = modelService.getRelation(image, word);
		if (relation==null) {
			modelService.createRelation(image, word, session);
		}
	}

	@Path(start="removeWord")
	public void removeWordFromImage(Request request) throws ModelException, SecurityException, ContentNotFoundException {
		UserSession session = request.getSession();
		long imageId = request.getInt("image");
		long wordId = request.getInt("word");
		Image image = getImage(imageId,session);
		Word word = modelService.get(Word.class, wordId, session);
		if (word==null) {
			throw new ContentNotFoundException("The word was not found");
		}
		Relation relation = modelService.getRelation(image, word);
		if (relation!=null) {
			modelService.deleteRelation(relation, session);
		}
	}

	@Path(start="searchWords")
	public void searchWords(Request request) throws IOException {
		String text = request.getString("text");
		Integer page = request.getInt("page");
		if (page==null) page=0;
		ListData list = new ListData();
		list.addHeader("Word");
		Query<Word> query = Query.of(Word.class).withWords(text).withPaging(page, 50);
		SearchResult<Word> result = modelService.search(query);
		list.setWindow(result.getTotalCount(), 50, page);
		for (Word word : result.getList()) {
			String kind = word.getClass().getSimpleName().toLowerCase();
			list.newRow(word.getId(),kind);
			list.addCell(word.getName(), word.getIcon());
		}
		request.sendObject(list);
	}
	
	@Path
	public void deleteImage(Request request) throws SecurityException, ModelException, ContentNotFoundException {
		long imageId = request.getLong("imageId");
		Image image = getImage(imageId, request.getSession());
		if (image!=null) {
			imageService.deleteImage(image,request.getSession());
		} else {
			throw new ContentNotFoundException(Image.class,imageId);
		}
	}
	
	@Path(start="changeAccess")
	public void changeAccess(Request request) throws SecurityException, ModelException, ContentNotFoundException {
		long imageId = request.getInt("image");
		boolean publicAccess = request.getBoolean("public");
		Image image = getImage(imageId, request.getSession());
		if (publicAccess) {
			securityService.makePublicVisible(image,request.getSession());			
		} else {
			securityService.makePublicHidden(image,request.getSession());
		}
	}
	
	@Path
	public SimpleEntityPerspective createGallery(Request request) throws IOException, EndUserException {
		ImageGallery gallery = imageGalleryService.createGallery(request.getSession());
		return SimpleEntityPerspective.create(gallery);
	}

	@Path
	public void uploadToGallery(Request request) throws IOException, EndUserException {
		DataImporter dataImporter = importService.createImporter();
		ImportListener listener = new ImageImporter(modelService,imageService);
		dataImporter.setListener(listener);
		dataImporter.importMultipart(this, request);
	}

	@Path
	public void updateGalleryTitle(Request request) throws ModelException, SecurityException, ContentNotFoundException {
		UserSession session = request.getSession();
		long id = request.getInt("id");
		String title = request.getString("title");
		ImageGallery gallery = modelService.get(ImageGallery.class, id, session);
		gallery.setName(title);
		modelService.updateItem(gallery, session);
	}

	@Path
	public <T extends Entity> void deleteGallery(Request request) throws SecurityException, ModelException, ContentNotFoundException {
		long id = request.getLong("id");
		Privileged privileged = request.getSession();
		ImageGallery gallery = modelService.get(ImageGallery.class, id, privileged);
		List<Class<T>> parts = Lists.newArrayList();
		parts.add(Code.<Class<T>>cast(HtmlPart.class));
		parts.add(Code.<Class<T>>cast(HeaderPart.class));
		User admin = modelService.getUser(SecurityService.ADMIN_USERNAME);
		for (Class<T> type : parts) {
			List<T> relations = modelService.getChildren(gallery, type, admin);
			for (T relation : relations) {
				modelService.deleteEntity(relation, privileged);
			}
		}
		modelService.deleteEntity(gallery, privileged);
	}
	
	@Path
	public void removeImageFromGallery(Request request) throws SecurityException, ModelException, ContentNotFoundException {
		long imageId = request.getLong("imageId");
		long galleryId = request.getLong("galleryId");
		UserSession session = request.getSession();
		Image image = modelService.getRequired(Image.class, imageId, session);
		ImageGallery gallery = modelService.getRequired(ImageGallery.class, galleryId, session);
		
		Relation relation = modelService.getRelation(gallery, image);
		if (relation!=null) {
			modelService.deleteRelation(relation, session);
		}
	}

}
