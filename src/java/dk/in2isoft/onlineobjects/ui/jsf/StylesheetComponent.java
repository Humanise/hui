package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.services.LifeCycleService;
import dk.in2isoft.onlineobjects.ui.Request;

@FacesComponent(value = StylesheetComponent.FAMILY)
public class StylesheetComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.stylesheet";
	
	private String href;
	private boolean core;
	private String msie;
	private boolean integrateCache;
	
	public StylesheetComponent() {
		super(FAMILY);
	}
	
	@Override
	public void restoreState(Object[] state) {
		core = (Boolean) state[0];
		href = (String) state[1];
		msie = (String) state[2];
		integrateCache = (Boolean) state[3];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { core, href, msie, integrateCache };
	}

	@Override
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		String href = getHref(context);
		if (href!=null) {
			StringBuilder url = new StringBuilder();
			if (href.startsWith("http")) {
				url.append(href);
			} else {
				Request request = Components.getRequest();
				if (core) {
					url.append(request.getBaseContext());
				} else {
					url.append(request.getLocalContext());
				}
				LifeCycleService bean = getBean(LifeCycleService.class);
				if (integrateCache) {
					int idx = href.lastIndexOf(".");
					url.append(href.substring(0,idx));
					url.append(".");
					url.append(bean.getStartTime().getTime());
					url.append(href.substring(idx));					
				} else {
					url.append(href);
					url.append("?").append(bean.getStartTime().getTime());					
				}				
			}
			if (Strings.isNotBlank(msie)) {
				writer.write("<!--[if ").write(msie).write("]>");
			}
			writer.writeStylesheet(url);
			if (Strings.isNotBlank(msie)) {
				writer.write("<![endif]-->");
			}
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
		return getExpression("href", href, context);
	}

	public String getMsie() {
		return msie;
	}

	public void setMsie(String msie) {
		this.msie = msie;
	}

	public boolean isIntegrateCache() {
		return integrateCache;
	}

	public void setIntegrateCache(boolean integrateCache) {
		this.integrateCache = integrateCache;
	}
}
