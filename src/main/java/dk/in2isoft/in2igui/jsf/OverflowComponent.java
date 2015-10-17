package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.ScriptWriter;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(OverflowComponent.TYPE)
@Dependencies(
	js = {"/hui/js/Overflow.js"},
	css = {"/hui/css/overflow.css"},
	requires = {HUIComponent.class}
)
public class OverflowComponent extends AbstractComponent {

	public static final String TYPE = "hui.overflow";

	private String name;
	private int height;
	private boolean full;
	private String shadowVariant;

	public OverflowComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
		height = (Integer) state[1];
		full = (Boolean) state[2];
		shadowVariant = (String) state[3];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { name, height, full, shadowVariant };
	}
	
	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		String id = getClientId();
		String cls = "hui_overflow";
		if (shadowVariant!=null) {
			cls+= " hui_overflow_shadow_"+shadowVariant;
		}
		out.startDiv().withClass(cls).withId(id);
		if (full) {
			out.withStyle("height: 100%;");
		}
		else if (height>0) {
			out.withStyle("height: "+height+"px;");
		}
		out.startDiv("hui_overflow_top").endDiv();
	}
	
	@Override
	protected void encodeEnd(FacesContext context, TagWriter out) throws IOException {
		out.startDiv("hui_overflow_bottom").endDiv();
		out.endDiv();
		ScriptWriter js = out.getScriptWriter().startScript();
		js.startNewObject("hui.ui.Overflow");
		js.property("element", getClientId());
		String name = getName(context);
		if (name!=null) {
			js.comma().property("name",name);
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

	public void setHeight(int height) {
		this.height = height;
	}

	public int getHeight() {
		return height;
	}

	public boolean isFull() {
		return full;
	}

	public void setFull(boolean full) {
		this.full = full;
	}

	public String getShadowVariant() {
		return shadowVariant;
	}

	public void setShadowVariant(String shadowVariant) {
		this.shadowVariant = shadowVariant;
	}
}
