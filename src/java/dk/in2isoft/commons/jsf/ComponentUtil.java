package dk.in2isoft.commons.jsf;

import java.util.Map;

import javax.el.ValueExpression;
import javax.faces.component.UIComponent;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

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

	public static <T> T  getExpressionValue(UIComponent component, String name, T localValue, FacesContext context) {

		ValueExpression valueExpression = component.getValueExpression(name);
		if (valueExpression != null) {
			Object value = valueExpression.getValue(context.getELContext());
			if (value != null) {
				return (T) value;
			}
		}
		return localValue;
	}

	public static <T> T  getService(Class<T> service, FacesContext context) {
		String simpleName = service.getSimpleName();
		String name = simpleName.substring(0, 1).toLowerCase()+simpleName.substring(1);
		ValueExpression valueExpression = context.getApplication().getExpressionFactory().createValueExpression(context.getELContext(),"#{"+name+"}",service);
		Object value = valueExpression.getValue(context.getELContext());
		if (value!=null && service.isAssignableFrom(value.getClass())) {
			return (T) value;
		}
		return null;
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
	
	@SuppressWarnings("unchecked")
	public static <T> T getBean(Class<T> type) {
		ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
		WebApplicationContext webApplicationContext = WebApplicationContextUtils.getWebApplicationContext((ServletContext) context.getContext());
		Map<?,?> beans = webApplicationContext.getBeansOfType(type);
		if (!beans.isEmpty()) {
			return (T) beans.values().iterator().next();
		}
		return null;
	}
}
