package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=ButtonComponent.TYPE)
public class ButtonComponent extends AbstractComponent {

	public static final String TYPE = "in2igui.button";

	private String text;
	private String name;
	private boolean highlighted;
	private boolean small;

	public ButtonComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		text = (String) state[0];
		name = (String) state[1];
		highlighted = (Boolean) state[2];
		small = (Boolean) state[3];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
			text,name,highlighted,small
		};
	}
	
	@Override
	public String getFamily() {
		return TYPE;
	}

	@Override
	public void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		String id = getClientId();
		if (small) {
			writer.startVoidA("in2igui_button in2igui_button_small_rounded");
		} else if (highlighted) {
			writer.startVoidA("in2igui_button in2igui_button_highlighted");
		} else {
			writer.startVoidA("in2igui_button");
		}
		writer.withId(id);
		writer.startSpan().startSpan().write(text).endSpan().endSpan();
		writer.endA();
		writer.startScopedScript();
		writer.write("new In2iGui.Button({element:'");
		writer.write(id);
		writer.write("'");
		if (name!=null) {
			writer.write(",name:'"+name+"'");
		}
		writer.write("});");
		writer.endScopedScript();
	}

	public void setHighlighted(boolean highlighted) {
		this.highlighted = highlighted;
	}

	public boolean isHighlighted() {
		return highlighted;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getText() {
		return text;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setSmall(boolean small) {
		this.small = small;
	}

	public boolean isSmall() {
		return small;
	}
}
