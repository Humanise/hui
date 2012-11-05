package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;
import javax.faces.event.AbortProcessingException;
import javax.faces.event.ComponentSystemEvent;
import javax.faces.event.ListenerFor;
import javax.faces.event.PostAddToViewEvent;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.ui.jsf.model.MapPoint;

@ListenerFor(systemEventClass=PostAddToViewEvent.class)
@FacesComponent(value=MapComponent.FAMILY)
public class MapComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.box";
	
	private String variant;
	private String name;
	private int height = 200;
	private boolean dynamic = true;

	public MapComponent() {
		super(FAMILY);
	}
	
	@Override
	public void restoreState(Object[] state) {
		variant = (String) state[0];
		name = (String) state[1];
		height = (Integer) state[2];
		dynamic = (Boolean) state[3];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {variant,name,height,dynamic};
	}
	
	public void processEvent(ComponentSystemEvent event) throws AbortProcessingException {
		if (event instanceof PostAddToViewEvent) {
	        FacesContext context = FacesContext.getCurrentInstance();
	        ScriptComponent componentResource = new ScriptComponent();
	        componentResource.setSrc("http://maps.google.com/maps/api/js?sensor=false");
			context.getViewRoot().addComponentResource(context, componentResource,"body");
	    }
	    super.processEvent(event);
	};

	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		MapPoint point = getBinding("location");
		if (point!=null) {
		out.startDiv("oo_map").withId(getClientId()).withStyle("height: "+height+"px;");
		if (!dynamic) {
			out.startVoidA("oo_map_pin").endA();
		}
		out.endDiv();
		out.startScript();
		out.startNewObject("oo.Map").property("element", getClientId());
		out.comma().property("dynamic", dynamic);
		if (Strings.isNotBlank(name)) {
			out.comma().property("name", name);
		}
		out.write(",location:{latitude:"+point.getLatitude()+",longitude:"+point.getLongitude()+"}");
		out.endNewObject().endScript();
		}
	}

	public void setVariant(String variant) {
		this.variant = variant;
	}

	public String getVariant() {
		return variant;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	public int getHeight() {
		return height;
	}

	public void setDynamic(boolean dynamic) {
		this.dynamic = dynamic;
	}

	public boolean isDynamic() {
		return dynamic;
	}
}
