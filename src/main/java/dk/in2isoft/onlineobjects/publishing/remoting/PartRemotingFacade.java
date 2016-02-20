package dk.in2isoft.onlineobjects.publishing.remoting;

import java.util.List;
import java.util.Map;

import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.HeaderPart;
import dk.in2isoft.onlineobjects.model.HtmlPart;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.ImagePart;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;

public class PartRemotingFacade extends AbstractRemotingFacade {
	
	public void updateHeaderPart(long id,String text,Map<String,String> properties) throws EndUserException {
		HeaderPart part = (HeaderPart) modelService.get(HeaderPart.class, id,getRequest().getSession());
		updateProperties(part, properties);
		part.setText(text);
		modelService.updateItem(part, getUserSession());
	}
	
	public void updateHtmlPart(long id,String html,Map<String,String> properties) throws EndUserException {
		HtmlPart part = modelService.get(HtmlPart.class, id,getRequest().getSession());
		updateProperties(part, properties);
		part.setHtml(html);
		modelService.updateItem(part, getUserSession());
	}
	
	public void updateImagePart(long id,Long imageId,Map<String,String> properties) throws EndUserException {
		ImagePart part = modelService.get(ImagePart.class, id,getRequest().getSession());
		if (part==null) {
			return;
		}
		updateProperties(part, properties);
		UserSession priviledged = getUserSession();
		List<Relation> relations = modelService.getRelationsFrom(part, Image.class);
		for (Relation relation : relations) {
			modelService.deleteRelation(relation, priviledged);
		}
		if (imageId!=null) {
			Image image = modelService.get(Image.class, imageId,priviledged);
			modelService.createRelation(part, image, priviledged);
		}
		modelService.updateItem(part, priviledged);
	}
	
	private void updateProperties(Entity entity,Map<String,String> properties) {
		if (properties==null) return;
		entity.overrideFirstProperty(Property.KEY_STYLE_MARGIN_TOP, properties.get("top"));
		entity.overrideFirstProperty(Property.KEY_STYLE_MARGIN_BOTTOM, properties.get("bottom"));
		entity.overrideFirstProperty(Property.KEY_STYLE_MARGIN_LEFT, properties.get("left"));
		entity.overrideFirstProperty(Property.KEY_STYLE_MARGIN_RIGHT, properties.get("right"));
	}
}
