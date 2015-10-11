package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.onlineobjects.ui.Request;

@FacesComponent(value=ScriptSetupComponent.TYPE)
public class ScriptSetupComponent extends AbstractComponent {

	public static final String TYPE = "hui.scriptSetup";

	public ScriptSetupComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
		};
	}
	
	@Override
	public void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		Request request = Components.getRequest();

		writer.startScript().newLine();
		writer.write("window.hui = window.hui || {};").newLine();
		writer.write("hui.ui = hui.ui || {};").newLine();
		writer.write("hui.ui.context = '").write(request.getBaseContext()).write("';").newLine();
		writer.write("hui.ui.language = '").write(request.getLanguage()).write("';").newLine();
		writer.endScript().newLine();
	}
}
