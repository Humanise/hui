package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.commons.lang.Strings;

@FacesComponent(value = FontsComponent.FAMILY)
public class FontsComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.fonts";
	
	private String additional;
	
	public FontsComponent() {
		super(FAMILY);
	}
	
	@Override
	public Object[] saveState() {
		return new Object[] {};
	}
	
	@Override
	public void restoreState(Object[] state) {
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		String text = "Open+Sans:300italic,400italic,600italic,400,600,800,300|Lato:100";
		if (Strings.isNotBlank(additional)) {
			text+="|"+additional;
		}
		out.startElement("link").withHref("https://fonts.googleapis.com/css?family="+text).rel("stylesheet").type("text/css").endElement("link");
	}

	public String getAdditional() {
		return additional;
	}

	public void setAdditional(String additional) {
		this.additional = additional;
	}
}
