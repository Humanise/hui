package dk.in2isoft.onlineobjects.apps.community;

import java.io.File;
import java.util.List;

import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.core.ConversionFacade;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelFacade;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.WebSite;
import dk.in2isoft.onlineobjects.ui.XSLTInterface;

public class UserSite extends XSLTInterface {
	
	private static Logger log = Logger.getLogger(UserSite.class);
	
	private File stylesheet;
	private String data;
	
	public UserSite(CommunityController controller,User user) throws EndUserException {
		super();
		this.stylesheet = controller.getFile(new String[] {"xslt", "user.xsl"});
		ModelFacade model = Core.getInstance().getModel();
		ConversionFacade converter = Core.getInstance().getConverter();

		WebSite site = getUsersWebsite(user, model);
		
		data = "<?xml version='1.0'?><page>"+
		converter.generateXML(user).toXML()+
		converter.generateXML(site).toXML()+
		"</page>";
		log.debug(data);
	}

	private WebSite getUsersWebsite(User user,ModelFacade model)
	throws EndUserException {
		WebSite webSite = null;
		List<Relation> userSubs = model.getSubRelations(user);
		for (Relation relation : userSubs) {
			if (relation.getSubEntity().getType().equals(WebSite.TYPE)) {
				webSite = (WebSite) model.loadEntity(WebSite.class, relation.getSubEntity().getId());
			}
		}
		if (webSite==null) {
			throw new EndUserException("The user "+user.getUsername()+" has no website");
		} else {
			return webSite;
		}
	}
	
	@Override
	public String getData() {
		return data;
	}

	@Override
	public File getStylesheet() {
		return stylesheet;
	}

}
