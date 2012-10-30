package dk.in2isoft.in2igui.jsf;

import java.io.IOException;
import java.util.Iterator;
import java.util.List;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.event.AbortProcessingException;
import javax.faces.event.ComponentSystemEvent;
import javax.faces.event.ListenerFor;
import javax.faces.event.PostAddToViewEvent;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.ui.jsf.ScriptComponent;
import dk.in2isoft.onlineobjects.ui.jsf.StylesheetComponent;

@ListenerFor(systemEventClass=PostAddToViewEvent.class)
@FacesComponent(value=PagesComponent.FAMILY)
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
	
	public void processEvent(ComponentSystemEvent event) throws AbortProcessingException {
		if (event instanceof PostAddToViewEvent) {
	        FacesContext context = FacesContext.getCurrentInstance();
	        ScriptComponent script = new ScriptComponent();
	        script.setSrc("/hui/ext/Pages.js");
	        script.setCore(true);
			context.getViewRoot().addComponentResource(context, script,"head");
			StylesheetComponent css = new StylesheetComponent();
	        css.setHref("/hui/ext/pages.css");
	        css.setCore(true);
			context.getViewRoot().addComponentResource(context, css,"head");
	    }
	    super.processEvent(event);
	};

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
		out.startScript();
		out.startNewObject("hui.ui.Pages").property("element", getClientId());
		if (Strings.isNotBlank(name)) {
			out.comma().property("name", name);
		}
		out.endNewObject().endScript();
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}
	
}
