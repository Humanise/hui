package dk.in2isoft.in2igui.jsf;

import java.io.IOException;
import java.util.List;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringEscapeUtils;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ClassBuilder;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.ScriptWriter;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.onlineobjects.ui.jsf.model.Option;

@FacesComponent(value=DropDownComponent.TYPE)
@Dependencies(js = { "/hui/js/hui_animation.js", "/hui/js/DropDown.js" }, css = { "/hui/css/dropdown.css" }, requires = { HUIComponent.class })
public class DropDownComponent extends AbstractComponent {

	public static final String TYPE = "hui.dropDown";

	private String name;
	private String key;
	private Object value;

	public DropDownComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
		key = (String) state[1];
		value = state[2];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
			name, key, value
		};
	}
	
	@Override
	public void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		ClassBuilder cls = new ClassBuilder("hui_dropdown");
		String id = getClientId();
		writer.startVoidA(cls).withId(id);
		writer.startSpan().startSpan().startStrong().endStrong().endSpan().endSpan();
		writer.endA();
		ScriptWriter js = writer.getScriptWriter().startScript();
		
		js.startNewObject("hui.ui.DropDown").property("element", id);
		
		if (name!=null) {
			js.comma().property("name",name);
		}
		if (key!=null) {
			js.comma().property("key",key);
		}
		String items = getItems(context);
		if (items!=null) {
			js.comma().propertyRaw("items", items);
		}
		Object value = getValue(context);
		if (value!=null) {
			js.comma().property("value", value.toString());
		}
		js.endNewObject().endScript();
	}
	
	private String getItems(FacesContext context) {
		Object value = Components.getExpressionValue(this, "items", null, context);
		if (value instanceof List<?>) {
			List<?> list = (List<?>) value;
			StringBuilder sb = new StringBuilder("[");
			boolean first = true;
			for (Object object : list) {
				if (object instanceof Option) {
					Option option = (Option) object;
					if (!first) {
						sb.append(",");
					}
					sb.append("{");
					sb.append("text:'").append(StringEscapeUtils.escapeJavaScript(option.getLabel())).append("'");
					sb.append(",value:");
					if (option.getValue()==null) {
						sb.append("null");
					} else {
						sb.append("'").append(StringEscapeUtils.escapeJavaScript(option.getValue().toString())).append("'");
					}
					sb.append("}");
					first = false;
				}
			}
			sb.append("]");
			return sb.toString();
		}
		return null;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}
	
	public Object getValue() {
		return value;
	}
	
	public Object getValue(FacesContext context) {
		return getExpression("value", value, context);
	}
	
	public void setValue(Object value) {
		this.value = value;
	}
}
