package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponentBase;
import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringEscapeUtils;

import dk.in2isoft.commons.jsf.ComponentUtil;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value="in2igui.searchfield")
public class SearchFieldComponent extends UIComponentBase {

	private String name;
	private String placeholder;
	private int width;
	private int expandedWidth;
	private String value;

	@Override
	public Object saveState(FacesContext context) {
		Object[] state = new Object[] {
			super.saveState(context),name,placeholder,width,value,expandedWidth
		};
		return state;
	}
	
	@Override
	public void restoreState(FacesContext context, Object state) {
		Object[] values = (Object[]) state;
		super.restoreState(context, values[0]);
		name = (String) values[1];
		placeholder = (String) values[2];
		width = (Integer) values[3];
		value = (String) values[4];
		expandedWidth = (Integer) values[5];
	}
	
	@Override
	public String getFamily() {
		return "in2igui.textfield";
	}

	@Override
	public void encodeBegin(FacesContext context) throws IOException {
		String id = getClientId();
		String value = ComponentUtil.getBindingAsString(this, "value", this.value, context);
		TagWriter writer = new TagWriter(this,context);
		writer.startSpan("in2igui_searchfield").withId(id);
		if (width>0) {
			writer.withStyle("width: "+width+"px;");
		}
		writer.startEm("in2igui_searchfield_placeholder").write(placeholder).endEm();
		writer.startVoidA("in2igui_searchfield_reset").endA();
		writer.startSpan().startSpan();
		writer.startElement("input");
		if (value!=null) {
			writer.withAttribute("value", value);
		}
		writer.endElement("input");
		writer.endSpan().endSpan().endSpan();
		writer.startScopedScript();
		writer.write("new In2iGui.SearchField({element:'");
		writer.write(id);
		writer.write("'");
		if (name!=null) {
			writer.write(",name:'"+StringEscapeUtils.escapeJavaScript(name)+"'");
		}
		if (placeholder!=null) {
			writer.write(",placeholder:'"+StringEscapeUtils.escapeJavaScript(placeholder)+"'");
		}
		if (expandedWidth>0) {
			writer.write(",expandedWidth:"+expandedWidth);
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

	
}
