package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=BoxComponent.FAMILY)
public class BoxComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.box";
	private String variant;

	public BoxComponent() {
		super(FAMILY);
	}
	
	@Override
	public void restoreState(Object[] state) {
		variant = (String) state[0];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {variant};
	}

	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		out.startDiv("oo_box");
		out.startDiv("oo_box_top").startDiv().startDiv().endDiv().endDiv().endDiv();
		out.startDiv("oo_box_middle").startDiv("oo_box_middle").startDiv("oo_box_content");
	}

	@Override
	public void encodeEnd(FacesContext context, TagWriter out) throws IOException {
		out.endDiv().endDiv().endDiv();
		out.startDiv("oo_box_bottom").startDiv().startDiv().endDiv().endDiv().endDiv();
		out.endDiv();
	}
}
