package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value = FontsComponent.FAMILY)
public class FontsComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.fonts";
	
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
		out.startElement("link").withHref("http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,400,600,300|Lato:100").rel("stylesheet").type("text/css").endElement("link");
		// |Source+Sans+Pro:200,300,400,600,200italic,300italic,400italic
	}
}
