package dk.in2isoft.commons.jsf;

import java.io.IOException;
import java.util.Locale;
import java.util.Map;

import javax.el.ValueExpression;
import javax.faces.component.UIComponentBase;
import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringUtils;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;


public abstract class AbstractComponent extends UIComponentBase {
	
	private String family;
	
	public AbstractComponent(String family) {
		this.family = family;
	}
	
	@Override
	public final void restoreState(FacesContext context, Object state) {
		Object[] stt = (Object[]) state;
		restoreState((Object[]) stt[1]);
		super.restoreState(context, stt[0]);
	}

	@Override
	public final Object saveState(FacesContext context) {
		return new Object[] {
			super.saveState(context),
			saveState()
		};
	}

	protected Locale getLocale() {
		return FacesContext.getCurrentInstance().getViewRoot().getLocale();
	}
	
	protected abstract Object[] saveState();
	
	protected abstract void restoreState(Object[] state);
	
	@Override
	public String getFamily() {
		return family;
	}

	@Override
	public final void encodeBegin(FacesContext context) throws IOException {
		if (isRendered()) {
			TagWriter writer = new TagWriter(this,context);
			encodeBegin(context, writer);
		}
	}
	
	@Override
	public final void encodeChildren(FacesContext context) throws IOException {
		if (isRendered()) {
			TagWriter writer = new TagWriter(this,context);
			encodeChildren(context, writer);
			super.encodeChildren(context);
		}
	}
	
	@Override
	public final void encodeEnd(FacesContext context) throws IOException {
		if (isRendered()) {
			TagWriter writer = new TagWriter(this,context);
			encodeEnd(context,writer);
			super.encodeEnd(context);
		}
	}
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {};

	protected void encodeChildren(FacesContext context, TagWriter writer) throws IOException {};
	
	protected void encodeEnd(FacesContext context, TagWriter writer) throws IOException {}

	@SuppressWarnings("unchecked")
	public <T> T getBinding(String name) {
		ValueExpression valueExpression = this.getValueExpression(name);
		if (valueExpression!=null) {
			return (T) valueExpression.getValue(FacesContext.getCurrentInstance().getELContext());
		}
		return null;
	};

	@SuppressWarnings("unchecked")
	public <T> T getBean(Class<?> cls) {
		WebApplicationContext context = WebApplicationContextUtils.getWebApplicationContext(ComponentUtil.getRequest().getRequest().getSession().getServletContext());
		Map beansOfType = context.getBeansOfType(cls);
		if (beansOfType.isEmpty()) {
			return null;
		} else {
			return (T) beansOfType.values().iterator().next();
		}
	};
	
	@SuppressWarnings("unchecked")
	public <T> T getExpression(T localValue, String name) {
		ValueExpression valueExpression = this.getValueExpression(name);
		if (valueExpression!=null) {
			return (T) valueExpression.getValue(FacesContext.getCurrentInstance().getELContext());
		}
		return localValue;
	};

	protected boolean isNotBlank(String string) {
		return StringUtils.isNotBlank(string);
	}
	
}
