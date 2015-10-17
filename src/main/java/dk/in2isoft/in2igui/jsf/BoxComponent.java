package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=BoxComponent.TYPE)
@Dependencies(js = { "/hui/js/Box.js" }, css = { "/hui/css/box.css" }, requires = { HUIComponent.class })
public class BoxComponent extends AbstractComponent {

	public static final String TYPE = "hui.box";

	private String name;

	public BoxComponent() {
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
