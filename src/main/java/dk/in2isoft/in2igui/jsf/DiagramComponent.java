package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.ScriptWriter;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=DiagramComponent.TYPE)
@Dependencies(js = { "/hui/js/hui_animation.js", "/hui/js/hui_require.js", "/hui/js/Diagram.js" }, css = { "/hui/css/diagram.css" }, requires = { HUIComponent.class }, uses = {DrawingComponent.class})
public class DiagramComponent extends AbstractComponent {

	public static final String TYPE = "hui.button";

	private String name;

	public DiagramComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
			name
		};
	}
	
	@Override
	public void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		String id = getClientId();
		writer.startDiv().withClass("hui_diagram").withId(id).withStyle("height: 400px;").endDiv();
		
		ScriptWriter js = writer.getScriptWriter().startScript();
		js.startNewObject("hui.ui.Diagram").property("element", id);
		String name = getName(context);
		if (name!=null) {
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

	public String getName(FacesContext context) {
		return Components.getBindingAsString(this, "name", name, context);
	}
}
