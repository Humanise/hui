package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.ScriptWriter;
import dk.in2isoft.commons.jsf.TagWriter;

@Dependencies(js = { "/hui/js/TextField.js" }, css = { "/hui/css/formula.css" }, requires = { HUIComponent.class })
@FacesComponent(value = TextFieldComponent.TYPE)
public class TextFieldComponent extends AbstractComponent {

	static final String TYPE = "hui.textfield";

	private String name;
	private String key;
	private String inputName;
	private boolean secret;
	private String placeholder;
	private int width;
	private Integer maxHeight;
	private String value;
	private boolean adaptive = true;
	private boolean multiline;

	public TextFieldComponent() {
		super(TYPE);
	}

	@Override
	public Object[] saveState() {
		return new Object[] { name, secret, placeholder, width, value, inputName, adaptive, multiline, maxHeight };
	}

	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
		secret = (Boolean) state[1];
		placeholder = (String) state[2];
		width = (Integer) state[3];
		value = (String) state[4];
		inputName = (String) state[5];
		adaptive = (Boolean) state[6];
		multiline = (Boolean) state[7];
		maxHeight = (Integer) state[8];
	}

	@Override
	public void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		String id = getClientId();
		String value = Components.getBindingAsString(this, "value", this.value, context);
		if (adaptive) {
			writer.startDiv("hui_field");
		} else {
			writer.startSpan("hui_field");
		}
		writer.withId(id);
		if (width > 0) {
			writer.withStyle("width: " + width + "px;");
		}
		if (StringUtils.isNotBlank(placeholder)) {
			writer.startEm("hui_field_placeholder").write(placeholder).endEm();
		}
		writer.startSpan("hui_field_top").startSpan().startSpan().endSpan().endSpan().endSpan();
		writer.startSpan("hui_field_middle").startSpan("hui_field_middle").startSpan("hui_field_content");
		if (multiline) {
			writer.startSpan("hui_formula_text_multiline");
			writer.startElement("textarea").withClass("hui_formula_text").write(value).endElement("textarea");
			writer.endSpan();
		} else {
			writer.startSpan("hui_field_singleline");
			writer.startElement("input").withClass("hui_formula_text");
			if (secret) {
				writer.withAttribute("type", "password");
			}
			if (value != null) {
				writer.withAttribute("value", value);
			}
			if (inputName != null) {
				writer.withAttribute("name", inputName);
			}
			writer.endElement("input");
			writer.endSpan();
		}
		writer.endSpan().endSpan().endSpan();
		writer.startSpan("hui_field_bottom").startSpan().startSpan().endSpan().endSpan().endSpan();
		if (adaptive) {
			writer.endDiv();
		} else {
			writer.endSpan();
		}
		ScriptWriter js = writer.getScriptWriter().startScript();
		js.startNewObject("hui.ui.TextField").property("element", id);
		if (name != null) {
			js.comma().property("name", name);
		}
		if (key != null) {
			js.comma().property("key", key);
		}
		if (maxHeight != null) {
			js.comma().property("maxHeight", maxHeight);
		}
		js.endNewObject().endScript();
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setSecret(boolean secret) {
		this.secret = secret;
	}

	public boolean isSecret() {
		return secret;
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

	public void setInputName(String inputName) {
		this.inputName = inputName;
	}

	public String getInputName() {
		return inputName;
	}

	public void setAdaptive(boolean adaptive) {
		this.adaptive = adaptive;
	}

	public boolean isAdaptive() {
		return adaptive;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getKey() {
		return key;
	}

	public boolean isMultiline() {
		return multiline;
	}

	public void setMultiline(boolean multiline) {
		this.multiline = multiline;
	}

	public void setMaxHeight(Integer maxHeight) {
		this.maxHeight = maxHeight;
	}

	public Integer getMaxHeight() {
		return maxHeight;
	}
}
