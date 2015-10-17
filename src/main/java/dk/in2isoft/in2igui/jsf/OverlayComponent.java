package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.in2igui.jsf.HUIComponent;

@FacesComponent(value=OverlayComponent.FAMILY)
@Dependencies(js = { "/hui/js/hui_color.js", "/hui/js/hui_animation.js", "/hui/js/Overlay.js" }, css = { "/hui/css/overlay.css" }, requires = { HUIComponent.class }, uses = { ButtonComponent.class })
public class OverlayComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.locationpicker";
		
	public OverlayComponent() {
		super(FAMILY);
	}

	@Override
	public void restoreState(Object[] state) {
	}

	@Override
	public Object[] saveState() {
		return new Object[] { };
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
	}

}
