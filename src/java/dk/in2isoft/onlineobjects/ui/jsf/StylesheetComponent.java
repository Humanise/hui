package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ComponentUtil;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.onlineobjects.services.LifeCycleService;
import dk.in2isoft.onlineobjects.ui.Request;

@FacesComponent(value = StylesheetComponent.FAMILY)
public class StylesheetComponent<T> extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.stylesheet";
	
	private String href;
	private boolean core;
	
	public StylesheetComponent() {
		super(FAMILY);
	}
	
	@Override
	public void restoreState(Object[] state) {
		core = (Boolean) state[0];
		href = (String) state[1];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { core, href };
	}

	@Override
	public String getFamily() {
		return FAMILY;
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		String href = getHref(context);
		if (href!=null) {
			StringBuilder url = new StringBuilder();
			if (href.startsWith("http")) {
				url.append(href);
			} else {
				Request request = ComponentUtil.getRequest();
				if (core) {
					url.append(request.getBaseContext());
				} else {
					url.append(request.getLocalContext());
				}
				url.append(href);
				LifeCycleService bean = getBean(LifeCycleService.class);
				url.append("?").append(bean.getStartTime().getTime());
			}
			writer.writeStylesheet(url);
		}
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
		return getExpression(href,"href");
	}
}
