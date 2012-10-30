package dk.in2isoft.in2igui.jsf;

import java.io.IOException;
import java.util.List;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=PageComponent.FAMILY)
public class PageComponent extends AbstractComponent {

	public static final String FAMILY = "hui.page";

	public PageComponent() {
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
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		out.startDiv("hui_pages_page");
		List<UIComponent> siblings = getParent().getChildren();
		if (siblings.get(0)!=this) {
			out.withStyle("display:none;");
		}
	}
	
	@Override
	protected void encodeEnd(FacesContext context, TagWriter out) throws IOException {
		out.endDiv();
	}
	
}
