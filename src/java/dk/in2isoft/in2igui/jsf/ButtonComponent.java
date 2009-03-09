package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponentBase;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;

@FacesComponent(value="in2igui.button")
public class ButtonComponent extends UIComponentBase {

	private String text;
	private String name;
	private boolean highlighted;
	
	@Override
	public void restoreState(FacesContext context, Object state) {
		Object[] stt = (Object[]) state;
		super.restoreState(context, stt[0]);
		text = (String) stt[1];
		name = (String) stt[2];
		highlighted = (Boolean) stt[3];
	}

	@Override
	public Object saveState(FacesContext context) {
		Object[] state = new Object[] {
			super.saveState(context),text,name,highlighted
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
		ResponseWriter writer = context.getResponseWriter();
		writer.startElement("a", this);
		if (highlighted) {
			writer.writeAttribute("class", "in2igui_button in2igui_button_highlighted", null);
		} else {
			writer.writeAttribute("class", "in2igui_button", null);
		}
		writer.writeAttribute("href", "#", null);
		writer.writeAttribute("id", id, null);
		writer.startElement("span", this);
		writer.startElement("span", this);
		writer.write(text);
		writer.endElement("span");
		writer.endElement("span");
		writer.endElement("a");
		writer.startElement("script", this);
		writer.writeAttribute("type", "text/javascript", null);
		writer.write("new In2iGui.Button({element:'");
		writer.write(id);
		writer.write("'");
		if (name!=null) {
			writer.write(",name:'"+name+"'");
		}
		writer.write("});");
		writer.endElement("script");
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

	
}
