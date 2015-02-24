package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=DiagramComponent.TYPE)
public class DiagramComponent extends AbstractComponent {

	public static final String TYPE = "hui.button";

	private String name;

	public DiagramComponent() {
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
	public void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		String id = getClientId();
		writer.startDiv().withClass("hui_diagram").withId(id).withStyle("height: 400px;").endDiv();
		writer.startScopedScript();
		writer.write("new hui.ui.Diagram({element:'").write(id).write("'");
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
		return Components.getBindingAsString(this, "name", name, context);
	}
}
