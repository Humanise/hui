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
	private String align;

	public ButtonsComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
		align = (String) state[1];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
			name, align
		};
	}

	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		String cls = "hui_buttons";
		if ("right".equals(align)) {
			cls+=" hui_buttons_right";
		}
		out.startDiv(cls);
		out.startDiv("hui_buttons_body");
	}
	
	@Override
	protected void encodeEnd(FacesContext context, TagWriter out) throws IOException {
		out.endDiv().endDiv();
	}

	public void setAlign(String align) {
		this.align = align;
	}

	public String getAlign() {
		return align;
	}
}
