package dk.in2isoft.in2igui.jsf;

import javax.faces.component.FacesComponent;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Dependencies;

@FacesComponent(value = HUIComponent.TYPE)
// TODO Overlay and button are added since they are used for error reporting
@Dependencies(js = { "/hui/js/hui.js", "/hui/js/ui.js", "/hui/js/Component.js"}, uses = {OverlayComponent.class, ButtonComponent.class}) 
public class HUIComponent extends AbstractComponent {

	public static final String TYPE = "hui.ui";

	public HUIComponent() {
		super(TYPE);
	}

	@Override
	public void restoreState(Object[] state) {
	}

	@Override
	public Object[] saveState() {
		return new Object[] {};
	}

}
