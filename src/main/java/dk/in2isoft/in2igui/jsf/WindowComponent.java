package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ClassBuilder;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.ScriptWriter;
import dk.in2isoft.commons.jsf.StyleBuilder;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value = WindowComponent.TYPE)
@Dependencies(js = { "/hui/js/hui_animation.js", "/hui/js/Window.js" }, css = { "/hui/css/window.css" }, requires = {HUIComponent.class})
public class WindowComponent extends AbstractComponent {

	public static final String TYPE = "hui.window";

	private String title;
	private String name;
	private String variant;
	private int width;
	private int padding;

	public WindowComponent() {
		super(TYPE);
	}

	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
		width = (Integer) state[1];
		title = (String) state[2];
		padding = (Integer) state[3];
		variant = (String) state[4];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { name, width, title, padding, variant };
	}

	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		String title = getTitle(context);
		String id = getClientId();
		ClassBuilder cls = new ClassBuilder("hui_window").add("hui_window", variant);
		out.startDiv(cls).withId(id).withStyle("display:none;");
		out.startDiv("hui_window_front");
		out.startDiv("hui_window_close").endDiv();
		out.startDiv("hui_window_titlebar").startDiv().startDiv();
		out.startSpan("hui_window_title").text(title).endSpan();
		out.endDiv().endDiv().endDiv();
		out.startDiv("hui_window_content").startDiv("hui_window_content").startDiv("hui_window_body");
		StyleBuilder style = new StyleBuilder();
		if (width > 0) {
			style.withWidth(width);
		}
		if (padding > 0) {
			style.withPadding(padding);
		}
		if (!style.isEmpty()) {
			out.withStyle(style);
		}
	}

	@Override
	protected void encodeEnd(FacesContext context, TagWriter out) throws IOException {
		out.endDiv().endDiv().endDiv();
		out.startDiv("hui_window_bottom").startDiv("hui_window_bottom").startDiv("hui_window_bottom").endDiv().endDiv().endDiv();
		out.endDiv();
		out.endDiv();
		ScriptWriter js = out.getScriptWriter().startScript();
		String name = getName(context);
		js.startNewObject("hui.ui.Window");
		js.property("element", getClientId());
		if (name != null) {
			js.comma().property("name", name);
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

	public int getWidth() {
		return width;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	public int getPadding() {
		return padding;
	}

	public void setPadding(int padding) {
		this.padding = padding;
	}

	public String getTitle(FacesContext context) {
		return getExpression("title", title, context);
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getVariant() {
		return variant;
	}

	public void setVariant(String variant) {
		this.variant = variant;
	}

}
