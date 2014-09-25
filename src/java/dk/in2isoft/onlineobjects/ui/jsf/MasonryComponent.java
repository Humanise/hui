package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;
import java.util.List;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.ui.jsf.model.MasonryItem;

@FacesComponent(value=MasonryComponent.FAMILY)
public class MasonryComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.masonry";
	private String name;

	public MasonryComponent() {
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
		List<MasonryItem> list = Components.getExpressionValue(this, "list", context);
		out.startDiv("oo_masonry").withId(getClientId());
		
		for (MasonryItem item : list) {
			out.startA().withAttribute("data", Strings.toJSON(item)).withHref(item.href).text(item.title).endA();
			out.text(" ");
		}
		
		out.endDiv();
		
		out.startScript();
		out.startNewObject("oo.Masonry").property("element", getClientId());
		if (Strings.isNotBlank(name)) {
			out.comma().property("name", name);
		}
		out.endNewObject();
		out.endScript();
	}
}
