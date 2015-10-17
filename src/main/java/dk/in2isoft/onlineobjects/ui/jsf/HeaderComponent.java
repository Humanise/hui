package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ClassBuilder;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=HeaderComponent.FAMILY)
@Dependencies(css={"/WEB-INF/core/web/css/oo_header.css"})
public class HeaderComponent extends AbstractComponent {


	public static final String FAMILY = "onlineobjects.header";
	private String variant;
	private String styleClass;
	private int level = 1;
	
	public HeaderComponent() {
		super(FAMILY);
	}

	@Override
	public void restoreState(Object[] state) {
		variant = (String) state[0];
		styleClass = (String) state[1];
		level = (Integer) state[2];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {variant,styleClass,level};
	}

	public String getVariant() {
		return variant;
	}

	public void setVariant(String var) {
		this.variant = var;
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		writer.startElement("h"+level).withClass(new ClassBuilder("oo_header").add("oo_header", variant).add(styleClass)).withId(getId());
	}

	@Override
	protected void encodeEnd(FacesContext context, TagWriter writer) throws IOException {
		writer.endElement("h"+level);
	}

	public void setStyleClass(String styleClass) {
		this.styleClass = styleClass;
	}

	public String getStyleClass() {
		return styleClass;
	}

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}
}
