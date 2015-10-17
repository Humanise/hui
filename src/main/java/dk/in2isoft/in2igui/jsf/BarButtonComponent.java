package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.ScriptWriter;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=BarButtonComponent.TYPE)
public class BarButtonComponent extends AbstractComponent {

	public static final String TYPE = "hui.barButton";

	private String text;
	private String name;
	private boolean highlighted;
	private String icon;

	public BarButtonComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		text = (String) state[0];
		name = (String) state[1];
		highlighted = (Boolean) state[2];
		icon = (String) state[3];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
			text,name,highlighted,icon
		};
	}
	
	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		String id = getClientId();
		boolean highlighted = isHighlighted(context);
		if (highlighted) {
			out.startVoidA("hui_bar_button hui_bar_button_highlighted");
		} else {
			out.startVoidA("hui_bar_button");
		}
		out.withId(id);
		if (StringUtils.isNotBlank(icon)) {
			out.startSpan("hui_icon_1");
			String contextPath = Components.getRequest().getBaseContext();
			StringBuffer url = new StringBuffer();
			url.append("background-image: url('");
			url.append(contextPath);
			url.append("/hui/icons/").append(icon).append("16.png");
			url.append("');");
			out.withStyle(url).endSpan();
		}
		String text = getText(context);
		out.startSpan("hui_bar_button_text").write(text).endSpan();
		out.endA();
		ScriptWriter js = out.getScriptWriter();
		js.startScript();
		js.startNewObject("hui.ui.Bar.Button").property("element", id);
		if (isNotBlank(name)) {
			js.comma().property("name", name);
		}
		js.endNewObject();
		js.endScript();
	}

	public void setHighlighted(boolean highlighted) {
		this.highlighted = highlighted;
	}

	public boolean isHighlighted() {
		return highlighted;
	}

	public boolean isHighlighted(FacesContext context) {
		return getExpression("highlighted",highlighted,context);
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getText() {
		return text;
	}

	public String getText(FacesContext context) {
		return getExpression("text", text, context);
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getIcon() {
		return icon;
	}
}
