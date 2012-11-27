package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=ListComponent.TYPE)
public class ListComponent extends AbstractComponent {

	public static final String TYPE = "hui.list";

	private String name;
	private String source;

	public ListComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
		source = (String) state[1];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
			name, source
		};
	}
	
	@Override
	public String getFamily() {
		return TYPE;
	}

	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		String id = getClientId();
		out.startDiv().withClass("hui_list").withId(id);
		out.startDiv("hui_list_progress").endDiv();
		out.startDiv("hui_list_navigation");
		out.startDiv("hui_list_selection window_page").startDiv().startDiv("window_page_body").endDiv().endDiv().endDiv();
		out.startSpan("hui_list_count").endSpan();
		out.endDiv();
		out.startDiv("hui_list_body");
		out.startElement("table");
		out.startElement("thead").startElement("tr").endElement("tr").endElement("thead");
		out.startElement("tbody").endElement("tbody");
		out.endElement("table");
		UIComponent empty = getFacet("empty");
		if (empty!=null) {
			out.startDiv("hui_list_empty");
			empty.encodeAll(context);
			out.endDiv();
		}
	}
	
	@Override
	protected void encodeEnd(FacesContext context, TagWriter out) throws IOException {
		out.endDiv();
		out.endDiv();
		out.startScopedScript();
		out.startNewObject("hui.ui.List");
		out.property("element", getClientId());
		String name = getName(context);
		if (name!=null) {
			out.comma().property("name",name);
		}
		if (source!=null) {
			out.comma().propertyRaw("source", "hui.ui.get('"+source+"')");
		}
		out.endNewObject();
		out.endScopedScript();
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public String getName(FacesContext context) {
		return getExpression("name", name, context);
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getSource() {
		return source;
	}
}
