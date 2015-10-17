package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.ScriptWriter;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=RowsComponent.TYPE)
@Dependencies(
		js = {"/hui/js/Rows.js"},
		css = {"/hui/css/rows.css"},
		requires = {HUIComponent.class}
	)
public class RowsComponent extends AbstractComponent {

	public static final String TYPE = "hui.rows";

	private String name;
	private String height;

	public RowsComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
		height = (String) state[1];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { name, height };
	}
	
	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		String id = getClientId();
		String cls = "hui_rows";
		out.startDiv().withClass(cls).withId(id);
	}
	
	@Override
	protected void encodeEnd(FacesContext context, TagWriter out) throws IOException {
		out.endDiv();
		ScriptWriter js = out.getScriptWriter();
		js.startScript();
		js.startNewObject("hui.ui.Rows");
		js.property("element", getClientId());
		String name = getName(context);
		if (name!=null) {
			js.comma().property("name",name);
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
		return getExpression("name", name, context);
	}

	public void setHeight(String height) {
		this.height = height;
	}

	public String getHeight() {
		return height;
	}
}
