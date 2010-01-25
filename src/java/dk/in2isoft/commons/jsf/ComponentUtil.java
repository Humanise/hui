package dk.in2isoft.commons.jsf;

import java.util.Map;

import javax.el.ValueExpression;
import javax.faces.component.UIComponent;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.onlineobjects.ui.Request;

public class ComponentUtil {

	public static String getBindingAsString(UIComponent component, String name, String localValue, FacesContext context) {

		ValueExpression valueExpression = component.getValueExpression(name);
		if (valueExpression != null) {
			Object value = valueExpression.getValue(context.getELContext());
			if (value != null) {
				return value.toString();
			}
		}
		return localValue;
	}

	public static int getIntParameter(String name) {
		Map<String, String> map = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap();
		String string = map.get(name);
		if (StringUtils.isNotBlank(string) && StringUtils.isNumeric(string)) {
			return Integer.parseInt(string);
		}
		return 0;
	}

	public static Request getRequest() {
		ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
		return Request.get((HttpServletRequest) context.getRequest(), (HttpServletResponse) context.getResponse());
	}
}
