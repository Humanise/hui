package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.Request;

@FacesComponent(value = ScriptSetupComponent.FAMILY)
public class ScriptSetupComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.scriptsetup";
	
	public ScriptSetupComponent() {
		super(FAMILY);
	}
	
	@Override
	public void restoreState(Object[] state) {
	}

	@Override
	public Object[] saveState() {
		return new Object[] {};
	}

	@Override
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		writer.startScript().newLine();
		Request request = Components.getRequest();
		writer.write("window.oo = window.oo || {};").newLine();
		writer.write("oo.baseContext = '").write(request.getBaseContext()).write("';").newLine();
		writer.write("oo.baseDomainContext = '").write(request.getBaseDomainContext()).write("';").newLine();
		writer.write("oo.appContext = '").write(request.getLocalContext()).write("';").newLine();
		writer.write("oo.domainIsIp = '").write(request.isIP()).write("';").newLine();
		writer.write("oo.session = '").write(request.getSession().getId()).write("';").newLine();
		String username = SecurityService.PUBLIC_USERNAME;
		UserSession session = request.getSession();
		if (session!=null) {
			User user = session.getUser();
			if (user!=null) {
				username = user.getUsername();
			}
		}
		writer.write("oo.user = {userName:'").write(username).write("'};").newLine();
		if (StringUtils.isNotBlank(request.getLanguage())) {
			writer.write("oo.language = '").write(request.getLanguage()).write("';").newLine();
		}
		writer.endElement("script").newLine();
	}
}
