package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponentBase;
import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringEscapeUtils;

import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value="in2igui.textfield")
public class TextFieldComponent extends UIComponentBase {

	private String name;
	private boolean secret;
	private String placeholder;
	private int width;

	@Override
	public Object saveState(FacesContext context) {
		Object[] state = new Object[] {
			super.saveState(context),name,secret,placeholder,width
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
	}
	
	@Override
	public String getFamily() {
		return "in2igui.textfield";
	}

	@Override
	public void encodeBegin(FacesContext context) throws IOException {
		String id = getClientId();
		TagWriter writer = new TagWriter(this,context);
		writer.startDiv("in2igui_field").withId(id);
		if (width>0) {
			writer.withStyle("width: "+width+"px;");
		}
		writer.startSpan("in2igui_field_top").startSpan().startSpan().endSpan().endSpan().endSpan();
		writer.startSpan("in2igui_field_middle").startSpan("in2igui_field_middle").startSpan("in2igui_field_content");
		writer.startSpan("in2igui_formula_text_singleline");
		writer.startElement("input").withClass("in2igui_formula_text");
		if (secret) {
			writer.withAttribute("type", "password");
		}
		writer.endElement("input");
		writer.endSpan();
		writer.endSpan().endSpan().endSpan();
		writer.startSpan("in2igui_field_bottom").startSpan().startSpan().endSpan().endSpan().endSpan();
		writer.endDiv();
		writer.startScopedScript();
		writer.write("new In2iGui.Formula.Text({element:'");
		writer.write(id);
		writer.write("'");
		if (name!=null) {
			writer.write(",name:'"+StringEscapeUtils.escapeJavaScript(name)+"'");
		}
		if (placeholder!=null) {
			writer.write(",placeholder:'"+StringEscapeUtils.escapeJavaScript(placeholder)+"'");
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

	
}
