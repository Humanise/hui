package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=LayoutComponent.FAMILY)
public class LayoutComponent extends AbstractComponent {


	public static final String FAMILY = "onlineobjects.layout";
	
	public LayoutComponent() {
		super(FAMILY);
	}

	@Override
	public void restoreState(Object[] state) {
	}

	@Override
	public Object[] saveState() {
		return new Object[] {};
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		writer.startDiv("oo_layout");
		writer.startDiv("oo_layout_top");
		UIComponent top = getFacet("top");
		if (top!=null) {
			top.encodeAll(context);
		}
		writer.endDiv();
		writer.startDiv("oo_layout_middle");
		writer.startDiv("oo_layout_body");
	}

	@Override
	protected void encodeEnd(FacesContext context, TagWriter writer) throws IOException {
		writer.endDiv();
		writer.startDiv("oo_layout_sidebar");
		UIComponent sidebar = getFacet("sidebar");
		if (sidebar!=null) {
			sidebar.encodeAll(context);
		}
		writer.endDiv();
		writer.endDiv();
		writer.startDiv("oo_layout_bottom").endDiv();
		writer.endDiv();
	}
}
