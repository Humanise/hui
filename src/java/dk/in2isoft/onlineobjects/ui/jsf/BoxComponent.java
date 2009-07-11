package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponentBase;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value="onlineobjects.box")
public class BoxComponent <T> extends UIComponentBase {

	private static final String FAMILY = "onlineobjects.box";
	private String variant;

	@Override
	public String getFamily() {
		return FAMILY;
	}
	
	@Override
	public void restoreState(FacesContext context, Object state) {
		Object[] values = (Object[]) state;
		super.restoreState(context, values[0]);
		variant = (String) values[1];
	}

	@Override
	public Object saveState(FacesContext context) {
		return new Object[] {
			super.saveState(context),variant
		};
	}

	@Override
	public void encodeBegin(FacesContext context) throws IOException {
		TagWriter writer = new TagWriter(this, context);
		writer.startDiv("oo_box");
		writer.startDiv("oo_box_top").startDiv().startDiv().endDiv().endDiv().endDiv();
		writer.startDiv("oo_box_middle").startDiv("oo_box_middle").startDiv("oo_box_content");
	}

	@Override
	public void encodeEnd(FacesContext context) throws IOException {
		TagWriter writer = new TagWriter(this, context);
		writer.endDiv().endDiv().endDiv();
		writer.startDiv("oo_box_bottom").startDiv().startDiv().endDiv().endDiv().endDiv();
		writer.endDiv();
	}
}
