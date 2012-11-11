package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ComponentUtil;
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
	public String getFamily() {
		return TYPE;
	}

	@Override
	public void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		String id = getClientId();
		boolean highlighted = isHighlighted(context);
		if (highlighted) {
			writer.startVoidA("hui_bar_button hui_bar_button_highlighted");
		} else {
			writer.startVoidA("hui_bar_button");
		}
		writer.withId(id);
		if (StringUtils.isNotBlank(icon)) {
			writer.startSpan("hui_icon_1");
			String contextPath = ComponentUtil.getRequest().getBaseContext();
			StringBuffer url = new StringBuffer();
			url.append("background-image: url('");
			url.append(contextPath);
			url.append("/hui/icons/").append(icon).append("16.png");
			url.append("');");
			writer.withStyle(url).endSpan();
		}
		String text = getText(context);
		writer.startSpan("hui_bar_button_text").write(text).endSpan();
		writer.endA();
		writer.startScopedScript();
		writer.write("new hui.ui.Bar.Button({element:'");
		writer.write(id);
		writer.write("'");
		if (name!=null) {
			writer.write(",name:'"+name+"'");
		}
		writer.write("});");
		writer.endScopedScript();
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
