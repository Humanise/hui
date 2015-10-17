package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.ScriptWriter;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.in2igui.data.LocationData;

@FacesComponent(value="hui.locationInput")
@Dependencies(js = { "/hui/js/hui_require.js",  "/hui/js/LocationField.js", "/hui/js/LocationPicker.js", "/hui/js/Input.js", "/hui/js/NumberValidator.js" }, css = { "/hui/css/locationfield.css" }, requires = { HUIComponent.class}, uses = { LocationPickerComponent.class })
public class LocationInputComponent extends AbstractComponent {

	public LocationInputComponent() {
		super("hui.locationInput");
	}

	private String name;
	private String key;

	@Override
	public Object[] saveState() {
		return new Object[] {
			name,key
		};
	}
	
	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
		key = (String) state[1];
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		out.startSpan("hui_locationfield").withId(getClientId());
		out.startSpan("hui_field_top").startSpan().startSpan().endSpan().endSpan().endSpan();
		
		out.startSpan("hui_field_middle").startSpan("hui_field_middle").startSpan("hui_field_content");
		
		out.startSpan();
		
		out.startSpan("hui_locationfield_latitude").startSpan().startInput().endInput().endSpan().endSpan();
		
		out.startSpan("hui_locationfield_longitude").startSpan().startInput().endInput().endSpan().endSpan();

		out.endSpan();
		
		out.endSpan().endSpan().endSpan();
		
		out.startSpan("hui_field_bottom").startSpan().startSpan().endSpan().endSpan().endSpan();
		
		out.startVoidA("hui_locationfield_picker").endA();
		out.endSpan();
		
		LocationData location = getBinding("value");
		
		ScriptWriter js = out.getScriptWriter().startScript();
		js.startNewObject("hui.ui.LocationField").property("element", getClientId());
		if (name!=null) {
			js.comma().property("name", name);
		}
		if (key!=null) {
			js.comma().property("key", key);
		}
		if (location!=null) {
			js.write(",value:{");
			js.property("latitude", location.getLatitude()).comma().property("longitude", location.getLongitude());
			js.write("}");
		}
		js.write("});").endScript();
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
