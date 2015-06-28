package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.commons.lang.Strings;

@FacesComponent(value=FormulaComponent.TYPE)
public class FormulaComponent extends AbstractComponent {

	public static final String TYPE = "hui.formula";

	private String name;
	private String action;
	private String method;

	public FormulaComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
		action = (String) state[1];
		method = (String) state[2];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
			name, action, method
		};
	}
	
	@Override
	public void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		String id = getClientId();
		writer.startElement("form").withClass("hui_formula").withId(id);
		if (Strings.isNotBlank(action)) {
			writer.withAttribute("action", action);
		}
		if (Strings.isNotBlank(method)) {
			writer.withAttribute("method", method);
		}
	}
	
	@Override
	protected void encodeEnd(FacesContext context, TagWriter out) throws IOException {
		out.endElement("form");
		out.startScript();
		out.startNewObject("hui.ui.Formula").property("element", getClientId());
		if (name!=null) {
			out.comma().property("name", name);
		}		
		out.endNewObject();
		out.endScript();

	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		this.method = method;
	}
}
