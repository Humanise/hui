package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ClassBuilder;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.ScriptWriter;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=ListComponent.TYPE)
@Dependencies(
		js = {"/hui/js/DragDrop.js", "/hui/js/List.js"},
		css = {"/hui/css/list.css"},
				requires = {HUIComponent.class}, uses = {SourceComponent.class,IconComponent.class}
	)
public class ListComponent extends AbstractComponent {

	public static final String TYPE = "hui.list";

	private String name;
	private String source;
	private String variant;

	public ListComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
		source = (String) state[1];
		variant = (String) state[2];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
			name, source, variant
		};
	}
	
	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		String id = getClientId();
		ClassBuilder cls = new ClassBuilder("hui_list").add("hui_list", variant);
		out.startDiv().withClass(cls).withId(id);
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
		ScriptWriter js = out.getScriptWriter().startScript();
		js.startNewObject("hui.ui.List");
		js.property("element", getClientId());
		String name = getName(context);
		if (name!=null) {
			js.comma().property("name",name);
		}
		if (source!=null) {
			js.comma().propertyRaw("source", "hui.ui.get('"+source+"')");
		}
		js.endNewObject().endScript();
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

	public String getVariant() {
		return variant;
	}

	public void setVariant(String variant) {
		this.variant = variant;
	}
}
