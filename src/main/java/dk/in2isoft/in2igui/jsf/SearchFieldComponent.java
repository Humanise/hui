package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.ScriptWriter;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(SearchFieldComponent.TYPE)
@Dependencies(js = { "/hui/js/hui_animation.js", "/hui/js/SearchField.js" }, css = { "/hui/css/searchfield.css" }, requires = { HUIComponent.class })
public class SearchFieldComponent extends AbstractComponent {

	protected static final String TYPE = "hui.searchfield";
	private String name;
	private String placeholder;
	private int width;
	private int expandedWidth;
	private String value;
	private boolean adaptive;

	public SearchFieldComponent() {
		super(TYPE);
	}

	@Override
	protected Object[] saveState() {
		return new Object[] { name, placeholder, width, value, expandedWidth, adaptive };
	}

	@Override
	public void restoreState(Object[] values) {
		name = (String) values[0];
		placeholder = (String) values[1];
		width = (Integer) values[2];
		value = (String) values[3];
		expandedWidth = (Integer) values[4];
		adaptive = (Boolean) values[5];
	}

	@Override
	public void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		String id = getClientId();
		String value = Components.getBindingAsString(this, "value", this.value, context);
		writer.startSpan(adaptive ? "hui_searchfield hui_searchfield_adaptive" : "hui_searchfield").withId(id);
		if (width > 0) {
			writer.withStyle("width: " + width + "px;");
		}
		writer.startEm("hui_searchfield_placeholder").write(placeholder).endEm();
		writer.startVoidA("hui_searchfield_reset").endA();
		writer.startSpan().startSpan();
		writer.startElement("input");
		if (value != null) {
			writer.withAttribute("value", value);
		}
		writer.endElement("input");
		writer.endSpan().endSpan().endSpan();
		
		ScriptWriter js = writer.getScriptWriter().startScript();
		js.startNewObject("hui.ui.SearchField").property("element", id);
		if (name != null) {
			js.comma().property("name", name);
		}
		if (placeholder != null) {
			js.comma().property("placeholder", placeholder);
		}
		if (expandedWidth > 0) {
			js.comma().property("expandedWidth", expandedWidth);
		}
		js.endNewObject().endScript();
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setPlaceholder(String placeholder) {
		this.placeholder = placeholder;
	}

	public String getPlaceholder() {
		return placeholder;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	public int getWidth() {
		return width;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	public void setExpandedWidth(int expandedWidth) {
		this.expandedWidth = expandedWidth;
	}

	public int getExpandedWidth() {
		return expandedWidth;
	}

	public void setAdaptive(boolean adaptive) {
		this.adaptive = adaptive;
	}

	public boolean isAdaptive() {
		return adaptive;
	}

}
