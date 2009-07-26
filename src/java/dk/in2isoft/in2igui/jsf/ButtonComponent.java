package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponentBase;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value="in2igui.button")
public class ButtonComponent extends UIComponentBase {

	private String text;
	private String name;
	private boolean highlighted;
	private boolean small;
	
	@Override
	public void restoreState(FacesContext context, Object state) {
		Object[] stt = (Object[]) state;
		super.restoreState(context, stt[0]);
		text = (String) stt[1];
		name = (String) stt[2];
		highlighted = (Boolean) stt[3];
		small = (Boolean) stt[4];
	}

	@Override
	public Object saveState(FacesContext context) {
		Object[] state = new Object[] {
			super.saveState(context),text,name,highlighted,small
		};
		return state;
	}
	
	@Override
	public String getFamily() {
		return "in2igui.button";
	}

	@Override
	public void encodeBegin(FacesContext context) throws IOException {
		String id = getClientId();
		TagWriter writer = new TagWriter(this,context);
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
