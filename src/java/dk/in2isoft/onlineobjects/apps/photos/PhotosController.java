package dk.in2isoft.onlineobjects.apps.photos;

import java.io.IOException;

import dk.in2isoft.in2igui.data.ListData;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.ScriptWriter;
import dk.in2isoft.onlineobjects.ui.StylesheetWriter;
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
}
