package dk.in2isoft.onlineobjects.modules.images;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.SecurityService;
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

	public <T extends Entity>void deleteGallery(long id, Privileged privileged) throws ModelException, SecurityException, ContentNotFoundException {
		ImageGallery gallery = modelService.get(ImageGallery.class, id, privileged);
		if (gallery==null) {
			throw new ContentNotFoundException(ImageGallery.class, id);
		}
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
	
	public void changeSequence(long galleryId, final List<Long> imageIds, Privileged privileged) throws ModelException, ContentNotFoundException, SecurityException {
		ImageGallery gallery = modelService.getRequired(ImageGallery.class, galleryId, privileged);
		
		List<Relation> relations = modelService.getRelationsFrom(gallery, Image.class, privileged);
		Collections.sort(relations, new Comparator<Relation>() {

			@Override
			public int compare(Relation o1, Relation o2) {
				int index1 = imageIds.indexOf(o1.getTo().getId());
				int index2 = imageIds.indexOf(o2.getTo().getId());
				return index1-index2;
			}
		});
		float pos = 1;
		for (Relation relation : relations) {
			if (relation.getPosition()!=pos) {
				relation.setPosition(pos);
				modelService.updateItem(relation, privileged);
			}
			pos++;
		}
	}

	// Wiring...
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
}
