package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.ScriptWriter;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=CheckboxComponent.TYPE)
@Dependencies(js = { "/hui/js/Checkbox.js" }, css = { "/hui/css/checkbox.css" }, requires = { HUIComponent.class })
public class CheckboxComponent extends AbstractComponent {

	public static final String TYPE = "hui.checkbox";

	private String name;
	private String key;
	private String label;
	private Boolean value;

	public CheckboxComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
		key = (String) state[1];
		label = (String) state[2];
		value = (Boolean) state[3];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
			name, key, label, value
		};
	}
	
	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		String id = getClientId();
		Boolean value = getValue(context);
		out.startVoidA(Boolean.TRUE.equals(value) ? "hui_checkbox hui_checkbox_selected" : "hui_checkbox").withId(id);
		out.startSpan().startSpan().endSpan().endSpan();
		out.write(label);
		out.endA();
		
		ScriptWriter js = out.getScriptWriter().startScript();
		js.startNewObject("hui.ui.Checkbox").property("element", id);
		if (name!=null) {
			js.comma().property("name", name);
		}
		if (key!=null) {
			js.comma().property("key", key);
		}
		if (value!=null) {
			js.comma().property("value", value);
		}
		js.endNewObject().endScript();
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

	public void setLabel(String label) {
		this.label = label;
	}

	public String getLabel() {
		return label;
	}

	public String getLabel(FacesContext context) {
		return getExpression("label", label, context);
	}

	public void setValue(Boolean value) {
		this.value = value;
	}

	public Boolean getValue() {
		return value;
	}

	public Boolean getValue(FacesContext context) {
		return getExpression("value", value, context);
	}
}
