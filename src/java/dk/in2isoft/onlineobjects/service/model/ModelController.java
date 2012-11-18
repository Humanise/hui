package dk.in2isoft.onlineobjects.service.model;

import java.io.IOException;

import dk.in2isoft.in2igui.data.ListData;
import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.apps.words.views.WordListPerspectiveQuery;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.service.ServiceController;
import dk.in2isoft.onlineobjects.services.ConversionService;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class ModelController extends ServiceController {

	private ImageService imageService;
	private ModelService modelService;
	private ConversionService conversionService;

	public ModelController() {
		super("model");
	}
/*
	@Override
	public void unknownRequest(Request request) throws IOException, EndUserException {
		Element root = new Element("list");
		Document doc = new Document(root);
		List<Image> list = modelService.list(Query.of(Image.class).withPaging(0, 50));
		for (Image image : list) {
			Node node = conversionService.generateXML(image);
			root.appendChild(node);
		}
		HttpServletResponse response = request.getResponse();
		response.setContentType("text/xml");
		response.setCharacterEncoding("UTF-8");
		Serializer serializer = new Serializer(response.getOutputStream(), "UTF-8");
		serializer.write(doc);
	}*/
	
	@Path(start="listWords")
	public void listWords(Request request) throws IOException, ModelException {
		String text = request.getString("text");
		Integer page = request.getInt("page");
		if (page==null) page=0;
		ListData list = new ListData();
		list.addHeader("Word");
		list.addHeader("Language");
		list.addHeader("Category");
		WordListPerspectiveQuery query = new WordListPerspectiveQuery().withPaging(page, 50).startingWith(text);
		SearchResult<WordListPerspective> result = modelService.search(query);
		list.setWindow(result.getTotalCount(), 50, page);
		for (WordListPerspective word : result.getList()) {
			String kind = word.getClass().getSimpleName().toLowerCase();
			list.newRow(word.getId(),kind);
			list.addCell(word.getText());
			list.addCell(word.getLanguage());
			list.addCell(word.getLexicalCategory());
		}
		request.sendObject(list);
	}

	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}

	public ImageService getImageService() {
		return imageService;
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public ModelService getModelService() {
		return modelService;
	}

	public void setConversionService(ConversionService conversionService) {
		this.conversionService = conversionService;
	}

	public ConversionService getConversionService() {
		return conversionService;
	}

}
