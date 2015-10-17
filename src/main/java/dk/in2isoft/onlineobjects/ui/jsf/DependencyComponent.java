package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;

import org.eclipse.jdt.annotation.Nullable;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.onlineobjects.ui.Request;

@FacesComponent(value = DependencyComponent.FAMILY)
public class DependencyComponent extends AbstractComponent implements DependableComponent {

	public static final String FAMILY = "onlineobjects.dependency";
	
	private String src;
	private String from;
	
	public DependencyComponent() {
		super(FAMILY);
	}
	
	@Override
	public void restoreState(Object[] state) {
		src = (String) state[0];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { src };
	}

	@Override
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
	}
	
	@Override
	public String[] getScripts(FacesContext context) {
		String src = getSrc(context);
		if (isNotBlank(src) && src.endsWith(".js")) {
			return new String[] {src};
		}
		return null;
	}
	
	@Override
	public String[] getStyles(FacesContext context) {
		String src = getSrc(context);
		if (isNotBlank(src) && src.endsWith(".css")) {
			return new String[] {src};
		}
		return null;
	}
	
	@Override
	public Class<? extends UIComponent>[] getComponents(FacesContext context) {
		return null;
	}

	public void setSrc(String href) {
		this.src = href;
	}

	public String getSrc() {
		return src;
	}
	
	public String getSrc(FacesContext context) {
		@Nullable
		String value = getExpression("src", src, context);
		if (isNotBlank(from)) {
			Request request = Request.get(context);
			if (from.equals("local")) {
				value = "/WEB-INF/apps/" + request.getApplication() + "/web" + value;
			} else if (from.equals("core")) {
				value = "/WEB-INF/core/web" + value;
			}
		}
		return value;
	}

	public String getFrom() {
		return from;
	}

	public void setFrom(String from) {
		this.from = from;
	}
}
