package dk.in2isoft.onlineobjects.service.model;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import nu.xom.Document;
import nu.xom.Element;
import nu.xom.Node;
import nu.xom.Serializer;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.service.ServiceController;
import dk.in2isoft.onlineobjects.services.ConversionService;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class ModelController extends ServiceController {

	private ImageService imageService;
	private ModelService modelService;
	private ConversionService conversionService;

	public ModelController() {
		super("image");
	}

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
