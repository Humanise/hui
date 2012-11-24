package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=SourceComponent.TYPE)
public class SourceComponent extends AbstractComponent {

	public static final String TYPE = "hui.source";

	private String name;

	public SourceComponent() {
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
		out.startNewObject("hui.ui.Source").property("name", name);
		out.comma().property("url", "/test/service/model/listWords");
		out.endNewObject();
	}
	
}
