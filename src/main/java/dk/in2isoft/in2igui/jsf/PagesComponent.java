package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;
import javax.faces.event.ListenerFor;
import javax.faces.event.PostAddToViewEvent;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.ScriptWriter;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.commons.lang.Strings;

@FacesComponent(value=PagesComponent.FAMILY)
@Dependencies(js = { "/hui/js/hui_animation.js", "/hui/js/Pages.js" }, css = { "/hui/css/pages.css" }, requires = { HUIComponent.class })
public class PagesComponent extends AbstractComponent {

	public static final String FAMILY = "hui.pages";
	
	private String name;

	public PagesComponent() {
		super(FAMILY);
	}
	
	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {name};
	}

	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		out.startDiv("hui_pages").withId(getClientId());
	}
	
	@Override
	protected void encodeEnd(FacesContext context, TagWriter out) throws IOException {
		out.endDiv();
		ScriptWriter js = out.getScriptWriter().startScript();
		js.startNewObject("hui.ui.Pages").property("element", getClientId());
		if (Strings.isNotBlank(name)) {
			js.comma().property("name", name);
		}
		js.endNewObject().endScript();
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}
	
}
