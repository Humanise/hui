package dk.in2isoft.commons.jsf;

import java.util.List;
import java.util.Locale;
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

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.ui.Request;

public class Components {

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

	public static <T> T  getExpressionValue(UIComponent component, String name, FacesContext context) {
		return getExpressionValue(component, name, null, context);
	}
	
	public static <T> T  getExpressionValue(UIComponent component, String name, T localValue, FacesContext context) {

		ValueExpression valueExpression = component.getValueExpression(name);
		if (valueExpression != null) {
			Object value = valueExpression.getValue(context.getELContext());
			if (value != null) {
				return Code.cast(value);
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
			return Code.cast(value);
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
	
	public static <T> T getBean(Class<T> type) {
		ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
		WebApplicationContext webApplicationContext = WebApplicationContextUtils.getWebApplicationContext((ServletContext) context.getContext());
		Map<?,?> beans = webApplicationContext.getBeansOfType(type);
		if (!beans.isEmpty()) {
			return Code.cast(beans.values().iterator().next());
		}
		return null;
	}

	public static <T> T getChild(UIComponent component, Class<T> type) {
		List<UIComponent> children = component.getChildren();
		for (UIComponent child : children) {
			if (child.getClass().isAssignableFrom(type)) {
				return Code.cast(child);
			}
		}
		return null;
	}
	
	public static String buildLanguageUrl(Request request, Locale locale) {
		String[] path = request.getLocalPath();
		StringBuilder url = new StringBuilder();
		url.append("/");
		url.append(request.getLocalContext());
		for (int i = 0; i < path.length; i++) {
			if (i==0) {
				if (path[i].length()==2) {
					url.append(locale.getLanguage());
				} else {
					url.append(path[i]);
				}
			} else {
				url.append(path[i]);
			}
			url.append("/");
		}
		String queryString = request.getRequest().getQueryString();
		if (Strings.isNotBlank(queryString)) {
			url.append("?").append(queryString);			
		}
		return url.toString();
	}
}
