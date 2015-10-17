package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=FragmentComponent.TYPE)
@Dependencies(js = { "/hui/js/Fragment.js" }, requires = { HUIComponent.class })
public class FragmentComponent extends AbstractComponent {

	public static final String TYPE = "hui.fragment";

	private String name;

	public FragmentComponent() {
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
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		out.startDiv().withId(getClientId());
	}
	
	@Override
	protected void encodeEnd(FacesContext context, TagWriter out) throws IOException {
		out.endDiv();
		out.getScriptWriter().startScript().startNewObject("hui.ui.Fragment").property("element", getClientId()).comma().property("name", name).endNewObject().endScript();
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}
}
