package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ClassBuilder;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=OverflowComponent.TYPE)
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
		out.startScopedScript();
		out.startNewObject("hui.ui.Overflow");
		out.property("element", getClientId());
		String name = getName(context);
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
