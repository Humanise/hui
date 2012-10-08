package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ComponentUtil;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=BoundPanelComponent.TYPE)
public class BoundPanelComponent extends AbstractComponent {

	public static final String TYPE = "hui.boundPanel";

	private String name;
	private boolean hideOnClick;

	public BoundPanelComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
		hideOnClick = (Boolean) state[1];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
			name, hideOnClick
		};
	}
	
	@Override
	public String getFamily() {
		return TYPE;
	}

	@Override
	public void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		String id = getClientId();
		writer.startDiv().withClass("hui_boundpanel").withId(id).withStyle("display:none;");
		writer.startDiv("hui_boundpanel_arrow").endDiv();
		writer.startDiv("hui_boundpanel_top").startDiv().startDiv().endDiv().endDiv().endDiv();
		writer.startDiv("hui_boundpanel_body").startDiv("hui_boundpanel_body").startDiv("hui_boundpanel_body");
		writer.startDiv("hui_boundpanel_content");
	}
	
	@Override
	protected void encodeEnd(FacesContext context, TagWriter writer) throws IOException {
		writer.endDiv();
		writer.endDiv().endDiv().endDiv();
		writer.startDiv("hui_boundpanel_bottom").startDiv().startDiv().endDiv().endDiv().endDiv();
		writer.endDiv();
		writer.startScopedScript();
		writer.write("new hui.ui.BoundPanel({element:'").write(getClientId()).write("'");
		writer.write(",hideOnClick:"+hideOnClick);
		String name = getName(context);
		if (name!=null) {
			writer.write(",name:'"+name+"'");
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

	public String getName(FacesContext context) {
		return ComponentUtil.getBindingAsString(this, "name", name, context);
	}

	public boolean isHideOnClick() {
		return hideOnClick;
	}

	public void setHideOnClick(boolean hideOnClick) {
		this.hideOnClick = hideOnClick;
	}
}
