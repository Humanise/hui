package dk.in2isoft.onlineobjects.modules.images;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.HeaderPart;
import dk.in2isoft.onlineobjects.model.HtmlPart;
import dk.in2isoft.onlineobjects.model.ImageGallery;

public class ImageGalleryService {

	private ModelService modelService;
	
	public ImageGallery createGallery(Privileged priviledged) throws EndUserException {

		// Create an image gallery
		ImageGallery gallery = new ImageGallery();
		gallery.setName("Mine billeder");
		modelService.createItem(gallery, priviledged);

		// Create gallery title
		HeaderPart header = new HeaderPart();
		header.setText("Mine billeder");
		modelService.createItem(header, priviledged);
		modelService.createRelation(gallery, header, priviledged);

		// Create gallery title
		HtmlPart text = new HtmlPart();
		text.setHtml("Dette er nogle billeder jeg har taget");
		modelService.createItem(text, priviledged);
		modelService.createRelation(gallery, text, priviledged);

		return gallery;
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
}
