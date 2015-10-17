package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value = SelectionComponent.TYPE)
@Dependencies(js = { "/hui/js/Selection.js" }, css = { "/hui/css/selection.css" }, requires = { HUIComponent.class }, uses = { SourceComponent.class })
public class SelectionComponent extends AbstractComponent {

	public static final String TYPE = "hui.selection";

	private String name;

	public SelectionComponent() {
		super(TYPE);
	}

	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { name };
	}

	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		// TODO Not implemented yet
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public String getName(FacesContext context) {
		return Components.getExpressionValue(this, "name", name, context);
	}

}
