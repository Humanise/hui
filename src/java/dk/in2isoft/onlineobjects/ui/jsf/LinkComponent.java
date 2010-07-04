package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ClassBuilder;
import dk.in2isoft.commons.jsf.ComponentUtil;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.onlineobjects.ui.Request;

@FacesComponent(value = LinkComponent.FAMILY)
public class LinkComponent<T> extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.link";
	
	private String variant;
	private String href;
	private boolean core;
	private String styleClass;
	
	public LinkComponent() {
		super(FAMILY);
	}
	
	@Override
	public void restoreState(Object[] state) {
		variant = (String) state[0];
		core = (Boolean) state[1];
		href = (String) state[2];
		styleClass = (String) state[3];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { variant, core, href, styleClass };
	}

	@Override
	public String getFamily() {
		return FAMILY;
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		writer.startA(ClassBuilder.with("oo_link").add("oo_link",variant).add(styleClass));
		String id = getId();
		if (StringUtils.isNotBlank(id)) {
			writer.withId(id);
		}
		String href = getHref(context);
		if (href!=null) {
			writer.withAttribute("href", buildUrl(href, core));
		} else if (StringUtils.isNotBlank(id)) {
			writer.withAttribute("href","javascript: void(0);");
		}
		writer.startSpan();
	}
	
	public static String buildUrl(String href,boolean core) {
		if (href.startsWith("http") || href.startsWith("#") || href.startsWith("javascript:")) {
			return href;
		} else {
			StringBuilder url = new StringBuilder();
			Request request = ComponentUtil.getRequest();
			url.append(core ? request.getBaseContext() : request.getLocalContextPath());
			url.append(href);
			return url.toString();
		}
	}
	
	@Override
	protected void encodeEnd(FacesContext context, TagWriter writer) throws IOException {
		writer.endSpan().endA();
	}

	public void setVariant(String variant) {
		this.variant = variant;
	}

	public String getVariant() {
		return variant;
	}

	public void setCore(boolean core) {
		this.core = core;
	}

	public boolean isCore() {
		return core;
	}

	public void setHref(String href) {
		this.href = href;
	}

	public String getHref() {
		return href;
	}
	
	public String getHref(FacesContext context) {
		return getBinding(href,"href");
	}

	public void setStyleClass(String styleClass) {
		this.styleClass = styleClass;
	}

	public String getStyleClass() {
		return styleClass;
	}
}
