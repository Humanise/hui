package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=LayoutComponent.FAMILY)
@Dependencies(css={"/WEB-INF/core/web/css/oo_layout.css"},requires={OnlineObjectsComponent.class})
public class LayoutComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.layout";
	
	private String variant = "rounded";
	private boolean sidebar = true;
	
	public LayoutComponent() {
		super(FAMILY);
	}

	@Override
	public void restoreState(Object[] state) {
		variant = (String) state[0];
		sidebar = (Boolean) state[1];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { variant, sidebar };
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		writer.startDiv("oo_layout oo_layout_with_sidebar oo_layout_"+variant);
		writer.startDiv("oo_layout_left").endDiv();
		writer.startDiv("oo_layout_top");
		UIComponent top = getFacet("top");
		if (top!=null) {
			top.encodeAll(context);
		}
		writer.endDiv();
		writer.startDiv("oo_layout_middle");
		UIComponent sidebarComponent = getFacet("sidebar");
		if (sidebar && sidebarComponent!=null) {
			writer.startDiv("oo_layout_body oo_layout_body_sidebar");						
		} else {
			writer.startDiv("oo_layout_body");			
		}
	}

	@Override
	protected void encodeEnd(FacesContext context, TagWriter writer) throws IOException {
		writer.endDiv();
		UIComponent sidebarComponent = getFacet("sidebar");
		if (sidebar && sidebarComponent!=null) {
			writer.startDiv("oo_layout_sidebar");
			sidebarComponent.encodeAll(context);
			writer.endDiv();
		}
		writer.endDiv();
		writer.startDiv("oo_layout_right").endDiv();
		writer.startDiv("oo_layout_bottom").endDiv();
		writer.endDiv();
	}

	public String getVariant() {
		return variant;
	}

	public void setVariant(String variant) {
		this.variant = variant;
	}
	
	public void setSidebar(boolean sidebar) {
		this.sidebar = sidebar;
	}
	
	public boolean isSidebar() {
		return sidebar;
	}
}
