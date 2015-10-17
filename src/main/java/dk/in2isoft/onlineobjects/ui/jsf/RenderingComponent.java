package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ClassBuilder;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value = RenderingComponent.FAMILY)
@Dependencies(css={"/WEB-INF/core/web/css/oo_rendering.css"},requires={OnlineObjectsComponent.class})
public class RenderingComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.rendering";
	
	private String styleClass;
	
	public RenderingComponent() {
		super(FAMILY);
	}
	
	@Override
	public void restoreState(Object[] state) {
		styleClass = (String) state[0];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { styleClass };
	}

	@Override
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		writer.startDiv(new ClassBuilder("oo_rendering").add(getStyleClass(context)));
	}
	
	@Override
	protected void encodeEnd(FacesContext context, TagWriter writer) throws IOException {
		writer.endDiv();
	}

	public void setStyleClass(String styleClass) {
		this.styleClass = styleClass;
	}

	public String getStyleClass() {
		return styleClass;
	}

	public String getStyleClass(FacesContext context) {
		return getExpression("styleClass", styleClass, context);
	}
}
