package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=ButtonsComponent.TYPE)
public class ButtonsComponent extends AbstractComponent {

	public static final String TYPE = "hui.buttons";

	private String name;

	public ButtonsComponent() {
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
		out.startDiv("hui_buttons");
		out.startDiv("hui_buttons_right");
	}
	
	@Override
	protected void encodeEnd(FacesContext context, TagWriter out) throws IOException {
		out.endDiv().endDiv();
	}
}
