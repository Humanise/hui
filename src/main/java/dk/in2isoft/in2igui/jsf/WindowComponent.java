package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=WindowComponent.TYPE)
public class WindowComponent extends AbstractComponent {

	public static final String TYPE = "hui.window";

	private String title;
	private String name;
	private int width;

	public WindowComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
		width = (Integer) state[1];
		title = (String) state[2];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
			name, width, title
		};
	}
	
	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		String title = getTitle(context);
		String id = getClientId();
		out.startDiv().withClass("hui_window").withId(id).withStyle("display:none;");
		out.startDiv("hui_window_front");
		out.startDiv("hui_window_close").endDiv();
		out.startDiv("hui_window_titlebar").startDiv().startDiv();
		out.startSpan("hui_window_title").text(title).endSpan();
		out.endDiv().endDiv().endDiv();
		out.startDiv("hui_window_content").startDiv("hui_window_content").startDiv("hui_window_body");
		if (width>0) {
			out.withStyle("width:"+width+"px;");
		}
	}
	
	@Override
	protected void encodeEnd(FacesContext context, TagWriter out) throws IOException {
		out.endDiv().endDiv().endDiv();
		out.startDiv("hui_window_bottom").startDiv("hui_window_bottom").startDiv("hui_window_bottom").endDiv().endDiv().endDiv();
		out.endDiv();
		out.endDiv();
		out.startScopedScript();
		String name = getName(context);
		out.startNewObject("hui.ui.Window");
		out.property("element", getClientId());
		if (name!=null) {
			out.comma().property("name",name);
		}
		out.endNewObject();
		out.endScopedScript();
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

	public String getTitle(FacesContext context) {
		return getExpression("title", title, context);
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

}
