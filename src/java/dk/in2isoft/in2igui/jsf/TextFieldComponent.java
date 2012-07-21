package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponentBase;
import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.jsf.ComponentUtil;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value="hui.textfield")
public class TextFieldComponent extends UIComponentBase {

	private String name;
	private String key;
	private String inputName;
	private boolean secret;
	private String placeholder;
	private int width;
	private String value;
	private boolean adaptive = true;

	@Override
	public Object saveState(FacesContext context) {
		Object[] state = new Object[] {
			super.saveState(context),name,secret,placeholder,width,value,inputName,adaptive
		};
		return state;
	}
	
	@Override
	public void restoreState(FacesContext context, Object state) {
		Object[] values = (Object[]) state;
		super.restoreState(context, values[0]);
		name = (String) values[1];
		secret = (Boolean) values[2];
		placeholder = (String) values[3];
		width = (Integer) values[4];
		value = (String) values[5];
		inputName = (String) values[6];
		adaptive = (Boolean) values[7];
	}
	
	@Override
	public String getFamily() {
		return "hui.textfield";
	}

	@Override
	public void encodeBegin(FacesContext context) throws IOException {
		String id = getClientId();
		String value = ComponentUtil.getBindingAsString(this, "value", this.value, context);
		TagWriter writer = new TagWriter(this,context);
		if (adaptive) {
			writer.startDiv("hui_field");
		} else {
			writer.startSpan("hui_field");
		}
		writer.withId(id);
		if (width>0) {
			writer.withStyle("width: "+width+"px;");
		}
		if (StringUtils.isNotBlank(placeholder)) {
			writer.startEm("hui_field_placeholder").write(placeholder).endEm();
		}
		writer.startSpan("hui_field_top").startSpan().startSpan().endSpan().endSpan().endSpan();
		writer.startSpan("hui_field_middle").startSpan("hui_field_middle").startSpan("hui_field_content");
		writer.startSpan("hui_field_singleline");
		writer.startElement("input").withClass("hui_formula_text");
		if (secret) {
			writer.withAttribute("type", "password");
		}
		if (value!=null) {
			writer.withAttribute("value", value);
		}
		if (inputName!=null) {
			writer.withAttribute("name", inputName);
		}
		writer.endElement("input");
		writer.endSpan();
		writer.endSpan().endSpan().endSpan();
		writer.startSpan("hui_field_bottom").startSpan().startSpan().endSpan().endSpan().endSpan();
		if (adaptive) {
			writer.endDiv();
		} else {
			writer.endSpan();
		}
		writer.startScopedScript();
		writer.write("new hui.ui.TextField({element:'").write(id).write("'");
		if (name!=null) {
			writer.write(",name:'"+StringEscapeUtils.escapeJavaScript(name)+"'");
		}
		if (key!=null) {
			writer.write(",key:'"+StringEscapeUtils.escapeJavaScript(key)+"'");
		}
		writer.write("});");
		writer.endScopedScript();
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
	
}
