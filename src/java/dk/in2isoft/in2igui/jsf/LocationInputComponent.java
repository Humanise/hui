package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.in2igui.data.LocationData;

@FacesComponent(value="hui.locationInput")
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
	public String getFamily() {
		return "hui.textfield";
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
		
		out.startScopedScript();
		out.startNewObject("hui.ui.LocationField").property("element", getClientId());
		if (name!=null) {
			out.comma().property("name", name);
		}
		if (key!=null) {
			out.comma().property("key", key);
		}
		if (location!=null) {
			out.write(",value:{");
			out.property("latitude", location.getLatitude()).comma().property("longitude", location.getLongitude());
			out.write("}");
		}
		out.write("});");
		out.endScopedScript();
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
