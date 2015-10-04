package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;

import org.eclipse.jdt.annotation.Nullable;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.StyleBuilder;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=ObjectInputComponent.TYPE)
public class ObjectInputComponent extends AbstractComponent {

	public static final String TYPE = "hui.objectInput";

	private String name;

	public ObjectInputComponent() {
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
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		out.startDiv("hui_objectinput").withId(getClientId());
		out.startDiv("hui_objectinput_list").endDiv();
		{
			ButtonComponent choose = new ButtonComponent();
			choose.setSmall(true);
			choose.setText("Select...");
			choose.setStyleClass("hui_objectinput_choose");
			choose.encodeMarkup(context, out);
		}
		{
			ButtonComponent choose = new ButtonComponent();
			choose.setSmall(true);
			choose.setText("Remove");
			choose.setDisabled(true);
			choose.setStyleClass("hui_objectinput_remove");
			choose.encodeMarkup(context, out);
		}
	}
	
	@Override
	protected void encodeEnd(FacesContext context, TagWriter writer) throws IOException {
		writer.endDiv();
		writer.startScopedScript();
		writer.startNewObject("hui.ui.ObjectInput").property("id", getClientId()).comma().property("name", name);
		FinderComponent finder = Components.getChild(this, FinderComponent.class);
		if (finder!=null) {
			String finderName = finder.getName(context);
			if (finderName!=null) {
				writer.comma().property("finder", finderName);
			}
		}
		writer.endNewObject();
		writer.endScopedScript();
		
	}


	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

}
