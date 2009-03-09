package dk.in2isoft.onlineobjects.publishing;

import java.util.Map;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.HeaderPart;
import dk.in2isoft.onlineobjects.model.HtmlPart;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;

public class PartRemotingFacade extends AbstractRemotingFacade {
	
	public void updateHeaderPart(long id,String text,Map<String,String> properties) throws EndUserException {
		HeaderPart part = (HeaderPart) getModel().get(HeaderPart.class, id);
		updateProperties(part, properties);
		part.setText(text);
		getModel().updateItem(part, getUserSession());
	}
	
	public void updateHtmlPart(long id,String html,Map<String,String> properties) throws EndUserException {
		HtmlPart part = getModel().get(HtmlPart.class, id);
		updateProperties(part, properties);
		part.setHtml(html);
		getModel().updateItem(part, getUserSession());
	}
	
	private void updateProperties(Entity entity,Map<String,String> properties) {
		if (properties==null) return;
		entity.overrideFirstProperty(Property.KEY_STYLE_MARGIN_TOP, properties.get("top"));
		entity.overrideFirstProperty(Property.KEY_STYLE_MARGIN_BOTTOM, properties.get("bottom"));
		entity.overrideFirstProperty(Property.KEY_STYLE_MARGIN_LEFT, properties.get("left"));
		entity.overrideFirstProperty(Property.KEY_STYLE_MARGIN_RIGHT, properties.get("right"));
	}
}
