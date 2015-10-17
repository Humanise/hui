package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ScriptWriter;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=FragmentComponent.FAMILY)
public class FragmentComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.fragment";
	
	private String name;

	public FragmentComponent() {
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
		out.startDiv("oo_fragment").withId(getClientId());
		out.endDiv();
		ScriptWriter js = out.getScriptWriter();
		js.startScript();
		js.startNewObject("oo.Fragment").property("element", getClientId());
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
}
