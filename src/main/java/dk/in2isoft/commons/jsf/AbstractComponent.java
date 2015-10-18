package dk.in2isoft.commons.jsf;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.el.ValueExpression;
import javax.faces.component.UIComponent;
import javax.faces.component.UIComponentBase;
import javax.faces.context.FacesContext;

import org.eclipse.jdt.annotation.NonNull;
import org.eclipse.jdt.annotation.Nullable;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.jsf.ScriptComponent;
import dk.in2isoft.onlineobjects.ui.jsf.StylesheetComponent;
import dk.in2isoft.onlineobjects.util.Messages;


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
	
	protected String getContext() {
		return Request.get(getFacesContext()).getBaseContext();
	}

	protected Locale getLocale() {
		return FacesContext.getCurrentInstance().getViewRoot().getLocale();
	}
	
	protected abstract Object[] saveState();
	
	protected abstract void restoreState(Object[] state);
	
	@Override
	public final String getFamily() {
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
		if (isRendered() && shouldEncodeChildren()) {
			TagWriter writer = new TagWriter(this,context);
			encodeEnd(context,writer);
			super.encodeEnd(context);
		}
	}
	
	protected boolean shouldEncodeChildren() {
		return true;
	}
	
	protected void encodeBegin(FacesContext context, TagWriter out) throws IOException {};

	protected void encodeChildren(FacesContext context, TagWriter out) throws IOException {};
	
	protected void encodeEnd(FacesContext context, TagWriter out) throws IOException {}

	public void add(UIComponent child) {
		getChildren().add(child);
	}
	
	public <T> @Nullable T getBinding(String name) {
		ValueExpression valueExpression = this.getValueExpression(name);
		if (valueExpression!=null) {
			return Code.cast(valueExpression.getValue(FacesContext.getCurrentInstance().getELContext()));
		}
		return null;
	};

	public <T> @Nullable T getBean(Class<?> cls) {
		WebApplicationContext context = WebApplicationContextUtils.getWebApplicationContext(Components.getRequest().getRequest().getSession().getServletContext());
		Map<?,?> beansOfType = context.getBeansOfType(cls);
		if (beansOfType.isEmpty()) {
			return null;
		} else {
			return Code.cast(beansOfType.values().iterator().next());
		}
	};
	
	protected Messages getMessages() {
		return new Messages(getClass());
	}
	
	public boolean getExpression(@NonNull String name, boolean localValue, FacesContext context) {
		return Components.getExpressionValue(this, name, localValue, context);
	};

	public @Nullable <T> T getExpression(@NonNull String name, T localValue, FacesContext context) {
		return Components.getExpressionValue(this, name, localValue, context);
	};

	public @Nullable <T> T getExpression(@NonNull String name, FacesContext context) {
		return Components.getExpressionValue(this, name, null, context);
	};

	protected Request getRequest() {
		return Request.get(getFacesContext());
	}
	
	protected boolean isNotBlank(String string) {
		return Strings.isNotBlank(string);
	}


	protected boolean isInteger(String str) {
		return Strings.isInteger(str);
	}
	
	protected void requireScript(String string) {
        FacesContext context = getFacesContext();
        ScriptComponent script = new ScriptComponent();
        script.setSrc(string);
        script.setCore(true);
		context.getViewRoot().addComponentResource(context, script,"head");
	}

	protected void requireStylesheet(String string) {
		FacesContext context = getFacesContext();
		StylesheetComponent css = new StylesheetComponent();
        css.setHref(string);
        css.setCore(true);
		context.getViewRoot().addComponentResource(context, css, "head");
	}

}
