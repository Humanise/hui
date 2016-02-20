package dk.in2isoft.onlineobjects.apps.photos;

import java.io.IOException;
import java.util.List;

import com.google.common.collect.Lists;

import dk.in2isoft.in2igui.data.ListData;
import dk.in2isoft.onlineobjects.apps.photos.perspectives.GalleryModificationRequest;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.ImageGallery;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.importing.DataImporter;
import dk.in2isoft.onlineobjects.modules.importing.ImportListener;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.data.SimpleEntityPerspective;
import dk.in2isoft.onlineobjects.util.images.ImageInfo.ImageLocation;
import dk.in2isoft.onlineobjects.util.images.ImageMetaData;


public class PhotosController extends PhotosControllerBase {

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

	@Path
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

	@Path
	public <T extends Entity> void synchronizeMetaData(Request request) throws EndUserException {
		long id = request.getLong("imageId");
		Privileged privileged = request.getSession();
		Image image = modelService.getRequired(Image.class, id, privileged);
		imageService.synchronizeMetaData(image, privileged);
	}
	
	@Path
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
		ImportListener<?> listener = new ImageGalleryImporter(modelService,imageService);
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
		imageGalleryService.deleteGallery(id, privileged);
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
	
	@Path
	public void addImagesToGallery(Request request) throws SecurityException, ModelException, ContentNotFoundException, IllegalRequestException {
		UserSession session = request.getSession();
		GalleryModificationRequest per = request.getObject("info", GalleryModificationRequest.class);
		if (per==null) {
			throw new IllegalRequestException("Malformed data");
		}
		ImageGallery gallery = modelService.getRequired(ImageGallery.class, per.getGalleryId(), session);
		float position = getMaxImagePosition(gallery);
		int num = 0;
		for (SimpleEntityPerspective imagePerspective : per.getImages()) {
			Image image = modelService.get(Image.class, imagePerspective.getId(), session);
			if (image!=null) {
				num++;
				Relation relation = new Relation(gallery, image);
				relation.setPosition(position + num);
				modelService.createItem(relation, session);
			}
		}
	}

	@Path
	public void changeGallerySequence(Request request) throws SecurityException, ModelException, ContentNotFoundException {
		UserSession session = request.getSession();
		GalleryModificationRequest info = request.getObject("info", GalleryModificationRequest.class);
		List<Long> ids = Lists.newArrayList();
		for (SimpleEntityPerspective image : info.getImages()) {
			ids.add(image.getId());
		}
		imageGalleryService.changeSequence(info.getGalleryId(), ids, session);
	}
	
	private float getMaxImagePosition(Entity gallery) throws ModelException {
		float max = 0;
		List<Relation> relations = modelService.getRelationsFrom(gallery,Image.class);
		for (Relation relation : relations) {
			max = Math.max(max, relation.getPosition());
		}
		return max;
	}
	
	@Path
	public List<Image> imageFinderGallery(Request request) {
		UserSession session = request.getSession();
		Query<Image> query = Query.of(Image.class).withPrivileged(session).orderByCreated().descending();
		List<Image> list = modelService.list(query);
		return list;
	}

	@Path
	public ImageMetaData getMetaData(Request request) throws ModelException, SecurityException, IllegalRequestException {
		Long imageId = request.getLong("imageId");
		Image image = modelService.get(Image.class, imageId, request.getSession());
		if (image==null) {
			throw new IllegalRequestException("Unabe to load image");
		}
		
		ImageMetaData metaData = imageService.getMetaData(image);
		return metaData;
	}
}
