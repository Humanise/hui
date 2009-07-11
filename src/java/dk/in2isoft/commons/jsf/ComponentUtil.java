package dk.in2isoft.commons.jsf;

import javax.el.ValueExpression;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;

public class ComponentUtil {

	public static String getBindingAsString(UIComponent component, String name, String localValue, FacesContext context) {

		ValueExpression valueExpression = component.getValueExpression(name);
		if (valueExpression!=null) {
			Object value = valueExpression.getValue(context.getELContext());
			if (value!=null) {
				return value.toString();
			}
		}
		return localValue;
	}
}
