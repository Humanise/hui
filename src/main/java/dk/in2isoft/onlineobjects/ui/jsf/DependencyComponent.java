package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value = DependencyComponent.FAMILY)
public class DependencyComponent extends AbstractComponent implements DependableComponent {

	public static final String FAMILY = "onlineobjects.dependency";
	
	private String src;
	
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

	public void setSrc(String href) {
		this.src = href;
	}

	public String getSrc() {
		return src;
	}
	
	public String getSrc(FacesContext context) {
		return getExpression("src", src, context);
	}
}
