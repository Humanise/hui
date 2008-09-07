package dk.in2isoft.onlineobjects.publishing;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.model.HeaderPart;
import dk.in2isoft.onlineobjects.model.HtmlPart;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;

public class PartRemotingFacade extends AbstractRemotingFacade {
	
	public void updateHeaderPart(long id,String text) throws EndUserException {
		HeaderPart part = (HeaderPart) getModel().get(HeaderPart.class, id);
		part.setText(text);
		getModel().updateItem(part, getUserSession());
	}
	
	public void updateHtmlPart(long id,String html) throws EndUserException {
		HtmlPart part = getModel().get(HtmlPart.class, id);
		part.setHtml(html);
		getModel().updateItem(part, getUserSession());
	}
}
