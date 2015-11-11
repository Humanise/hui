package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.ScriptWriter;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value = ObjectInputComponent.TYPE)
@Dependencies(js = { "/hui/js/ObjectInput.js" }, css = { "/hui/css/objectinput.css" }, requires = { HUIComponent.class })
public class ObjectInputComponent extends AbstractComponent {

	public static final String TYPE = "hui.objectInput";

	private String name;
	private String key;

	public ObjectInputComponent() {
		super(TYPE);
	}

	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
		key = (String) state[1];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { name, key };
	}

	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		out.startDiv("hui_objectinput").withId(getClientId());
		out.startDiv("hui_objectinput_list").endDiv();
		out.startDiv("hui_objectinput_actions");
		{
			ButtonComponent choose = new ButtonComponent();
			choose.setSmall(true);
			choose.setText("Select...");
			choose.setStyleClass("hui_objectinput_choose");
			choose.encodeMarkup(context, out);
		}
		/*
		{
			ButtonComponent choose = new ButtonComponent();
			choose.setSmall(true);
			choose.setText("Remove");
			choose.setDisabled(true);
			choose.setStyleClass("hui_objectinput_remove");
			choose.encodeMarkup(context, out);
		}*/
		out.endDiv();
	}

	@Override
	protected void encodeEnd(FacesContext context, TagWriter writer) throws IOException {
		writer.endDiv();
		ScriptWriter js = writer.getScriptWriter();
		js.startScript();
		js.startNewObject("hui.ui.ObjectInput").property("element", getClientId()).comma().property("name", name);
		if (isNotBlank(key)) {
			js.comma().property("key", key);
		}
		FinderComponent finder = Components.getChild(this, FinderComponent.class);
		if (finder != null) {
			String finderName = finder.getName(context);
			if (finderName != null) {
				js.comma().property("finder", finderName);
			}
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

	public void setKey(String key) {
		this.key = key;
	}

	public String getKey() {
		return key;
	}

}
