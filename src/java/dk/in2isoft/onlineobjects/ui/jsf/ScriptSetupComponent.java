package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ComponentUtil;
import dk.in2isoft.commons.jsf.TagWriter;
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
	public String getFamily() {
		return FAMILY;
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		writer.startScript().newLine();
		Request request = ComponentUtil.getRequest();
		writer.write("oo.baseContext = '").write(request.getBaseContext()).write("';").newLine();
		writer.write("oo.baseDomainContext = '").write(request.getBaseDomainContext()).write("';").newLine();
		writer.write("oo.appContext = '").write(request.getLocalContext()).write("';").newLine();
		writer.write("oo.domainIsIp = '").write(request.isIP()).write("';").newLine();
		writer.write("oo.user = {userName:'").write(request.getSession().getUser().getUsername()).write("'};").newLine();
		if (StringUtils.isNotBlank(request.getLanguage())) {
			writer.write("oo.language = '").write(request.getLanguage()).write("';").newLine();
		}
		writer.endElement("script").newLine();
	}
}
