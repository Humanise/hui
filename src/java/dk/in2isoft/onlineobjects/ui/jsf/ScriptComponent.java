package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ComponentUtil;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.onlineobjects.services.LifeCycleService;
import dk.in2isoft.onlineobjects.ui.Request;

@FacesComponent(value = ScriptComponent.FAMILY)
public class ScriptComponent<T> extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.script";
	
	private String src;
	private boolean core;
	
	public ScriptComponent() {
		super(FAMILY);
	}
	
	@Override
	public void restoreState(Object[] state) {
		core = (Boolean) state[0];
		src = (String) state[1];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { core, src };
	}

	@Override
	public String getFamily() {
		return FAMILY;
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		writer.startElement("script").withAttribute("type", "text/javascript").withAttribute("charset", "utf-8");
		String src = getSrc(context);
		if (src!=null) {
			StringBuilder url = new StringBuilder();
			if (src.startsWith("http")) {
				url.append(src);
			} else {
				Request request = ComponentUtil.getRequest();
				if (core) {
					url.append(request.getBaseContext());
				} else {
					url.append(request.getLocalContext());
				}
				url.append(src);
				LifeCycleService bean = getBean(LifeCycleService.class);
				url.append("?").append(bean.getStartTime().getTime());
			}
			writer.withAttribute("src", url);
		}
	}
	
	@Override
	protected void encodeEnd(FacesContext context, TagWriter writer) throws IOException {
		writer.endElement("script");
	}

	public void setCore(boolean core) {
		this.core = core;
	}

	public boolean isCore() {
		return core;
	}

	public void setSrc(String href) {
		this.src = href;
	}

	public String getSrc() {
		return src;
	}
	
	public String getSrc(FacesContext context) {
		return getExpression(src,"src");
	}
}
