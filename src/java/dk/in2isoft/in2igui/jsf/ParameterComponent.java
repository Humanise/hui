package dk.in2isoft.in2igui.jsf;

import javax.faces.component.FacesComponent;

import dk.in2isoft.commons.jsf.AbstractComponent;

@FacesComponent(value=ParameterComponent.TYPE)
public class ParameterComponent extends AbstractComponent {

	public static final String TYPE = "hui.parameter";

	private String key;
	private String value;

	public ParameterComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		key = (String) state[0];
		value = (String) state[1];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { key, value };
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
	
}
