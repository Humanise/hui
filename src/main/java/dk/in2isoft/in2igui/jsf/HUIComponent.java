package dk.in2isoft.in2igui.jsf;

import javax.faces.component.FacesComponent;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Dependencies;

@FacesComponent(value = HUIComponent.TYPE)
@Dependencies(js = { "/hui/js/hui.js", "/hui/js/ui.js"})
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
