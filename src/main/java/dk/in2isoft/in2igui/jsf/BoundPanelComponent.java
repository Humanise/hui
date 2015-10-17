package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ClassBuilder;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.ScriptWriter;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=BoundPanelComponent.TYPE)
@Dependencies(js = { "/hui/js/hui_animation.js", "/hui/js/BoundPanel.js" }, css = { "/hui/css/boundpanel.css" }, requires = { HUIComponent.class })
public class BoundPanelComponent extends AbstractComponent {

	public static final String TYPE = "hui.boundPanel";

	private String name;
	private boolean hideOnClick;
	private int width;
	private String modal;
	private String variant;

	public BoundPanelComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
		hideOnClick = (Boolean) state[1];
		width = (Integer) state[2];
		modal = (String) state[3];
		variant = (String) state[4];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
			name, hideOnClick, width, modal, variant
		};
	}
	
	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		String id = getClientId();
		out.startDiv().withClass(ClassBuilder.with("hui_boundpanel").add("hui_boundpanel", variant)).withId(id).withStyle("display:none;");
		out.startDiv("hui_boundpanel_arrow").endDiv();
		out.startDiv("hui_boundpanel_top").startDiv().startDiv().endDiv().endDiv().endDiv();
		out.startDiv("hui_boundpanel_body").startDiv("hui_boundpanel_body").startDiv("hui_boundpanel_body");
		out.startDiv("hui_boundpanel_content");
		if (width>0) {
			out.withStyle("width:"+width+"px;");
		}
	}
	
	@Override
	protected void encodeEnd(FacesContext context, TagWriter out) throws IOException {
		out.endDiv();
		out.endDiv().endDiv().endDiv();
		out.startDiv("hui_boundpanel_bottom").startDiv().startDiv().endDiv().endDiv().endDiv();
		out.endDiv();
		ScriptWriter js = out.getScriptWriter();
		js.startScript();
		js.startNewObject("hui.ui.BoundPanel");
		js.property("element", getClientId());
		js.comma().property("hideOnClick", hideOnClick);
		if ("true".equals(modal)) {
			js.comma().property("modal", true);
		} else if (modal!=null) {
			js.comma().property("modal", modal);			
		}
		String name = getName(context);
		if (name!=null) {
			js.comma().property("name",name);
		}
		if (variant!=null) {
			js.comma().property("variant",variant);
		}
		js.endNewObject();
		js.endScript();
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public String getName(FacesContext context) {
		return Components.getBindingAsString(this, "name", name, context);
	}

	public boolean isHideOnClick() {
		return hideOnClick;
	}

	public void setHideOnClick(boolean hideOnClick) {
		this.hideOnClick = hideOnClick;
	}

	public int getWidth() {
		return width;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	public void setModal(String modal) {
		this.modal = modal;
	}

	public String getModal() {
		return modal;
	}

	public String getVariant() {
		return variant;
	}

	public void setVariant(String variant) {
		this.variant = variant;
	}
}
