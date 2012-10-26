package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ComponentUtil;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=BoxComponent.TYPE)
public class BoxComponent extends AbstractComponent {

	public static final String TYPE = "hui.box";

	private String name;

	public BoxComponent() {
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
		return ComponentUtil.getBindingAsString(this, "name", name, context);
	}
}
