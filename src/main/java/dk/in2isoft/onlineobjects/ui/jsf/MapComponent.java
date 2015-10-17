package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;
import javax.faces.event.AbortProcessingException;
import javax.faces.event.ComponentSystemEvent;
import javax.faces.event.ListenerFor;
import javax.faces.event.PostAddToViewEvent;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.ScriptWriter;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.in2igui.jsf.BoundPanelComponent;
import dk.in2isoft.onlineobjects.ui.jsf.model.MapPoint;
import dk.in2isoft.onlineobjects.util.Locations;
import dk.in2isoft.onlineobjects.util.Messages;

@ListenerFor(systemEventClass=PostAddToViewEvent.class)
@FacesComponent(value=MapComponent.FAMILY)
@Dependencies(js = { "/WEB-INF/core/web/js/oo_map.js" }, css = { "/WEB-INF/core/web/css/oo_map.css" }, requires = { OnlineObjectsComponent.class} ,uses= { BoundPanelComponent.class })
public class MapComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.map";
	
	private String variant;
	private String name;
	private int height = 200;
	private boolean dynamic = true;
	private boolean editable;

	public MapComponent() {
		super(FAMILY);
	}
	
	@Override
	public void restoreState(Object[] state) {
		variant = (String) state[0];
		name = (String) state[1];
		height = (Integer) state[2];
		dynamic = (Boolean) state[3];
		editable = (Boolean) state[4];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {variant,name,height,dynamic,editable};
	}
	
	public void processEvent(ComponentSystemEvent event) throws AbortProcessingException {
		if (dynamic && event instanceof PostAddToViewEvent) {
	        FacesContext context = FacesContext.getCurrentInstance();
	        ScriptComponent componentResource = new ScriptComponent();
	        componentResource.setSrc("http://maps.google.com/maps/api/js?sensor=false");
			context.getViewRoot().addComponentResource(context, componentResource,"body");
	    }
	    super.processEvent(event);
	};

	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		Messages msg = getMessages();
		MapPoint point = getBinding("location");
		boolean editable = isEditable(context);
		out.startDiv("oo_map").withId(getClientId());
		if (point!=null) {
			out.startDiv("oo_map_content").withId(getClientId());
			out.withStyle("height: "+height+"px;");
			if (!dynamic) {
				out.startVoidA("oo_map_pin").endA();
			}
			if (editable) {
				out.startVoidA("oo_map_edit").text(msg.get("edit", context.getViewRoot().getLocale())).endA();
			}
			out.endDiv();
		} else if (editable) {
			out.startVoidA("oo_map_add").text(msg.get("add_location", context.getViewRoot().getLocale())).endA();
		}
		out.endDiv();
		
		ScriptWriter js = out.getScriptWriter().startScript();
		js.startNewObject("oo.Map").property("element", getClientId());
		js.comma().property("dynamic", dynamic);
		js.comma().property("editable", editable);
		js.comma().property("info", buildInfo(point));
		if (isNotBlank(name)) {
			js.comma().property("name", name);
		}
		if (point!=null) {
			js.write(",location:{latitude:"+point.getLatitude()+",longitude:"+point.getLongitude()+"}");
		}
		js.endNewObject().endScript();
		
	}
	
	private String buildInfo(MapPoint point) {
		StringBuilder sb = new StringBuilder();
		if (point!=null) {
			sb.append("<table>");
			sb.append("<tr><th>Latitude:</th><td>").append(Locations.formatLatitude(point.getLatitude())).append("</td></tr>");
			sb.append("<tr><th>Longitude:</th><td>").append(Locations.formatLongitude(point.getLongitude())).append("</td></tr>");
			sb.append("</table>");
		}
		return sb.toString();
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

	public void setEditable(boolean editable) {
		this.editable = editable;
	}

	public boolean isEditable() {
		return editable;
	}

	public boolean isEditable(FacesContext context) {
		return getExpression("editable", editable, context);
	}
}
