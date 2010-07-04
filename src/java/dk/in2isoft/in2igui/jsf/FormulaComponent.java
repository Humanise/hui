package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=FormulaComponent.TYPE)
public class FormulaComponent extends AbstractComponent {

	public static final String TYPE = "in2igui.formula";

	private String name;

	public FormulaComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
			name
		};
	}
	
	@Override
	public String getFamily() {
		return TYPE;
	}

	@Override
	public void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		String id = getClientId();
		writer.startElement("form").withClass("in2igui_formula").withId(id);
	}
	
	@Override
	protected void encodeEnd(FacesContext context, TagWriter writer) throws IOException {
		writer.endElement("form");
		writer.startScopedScript();
		writer.write("new In2iGui.Formula({element:'");
		writer.write(getClientId());
		writer.write("'");
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
}
