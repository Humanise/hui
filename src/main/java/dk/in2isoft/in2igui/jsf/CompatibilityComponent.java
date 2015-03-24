package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.onlineobjects.ui.Request;

@FacesComponent(value=CompatibilityComponent.TYPE)
public class CompatibilityComponent extends AbstractComponent {

	public static final String TYPE = "hui.compatibility";

	public CompatibilityComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
	}

	@Override
	public Object[] saveState() {
		return new Object[] {};
	}
	
	@Override
	public void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		Request request = Components.getRequest();
		
		writer.write("<!--[if IE 8]><link rel=\"stylesheet\" type=\"text/css\" href=\"" + request.getBaseContext() + "/hui/css/msie8.css\"></link><![endif]-->");
		writer.write("<!--[if IE 7]><link rel=\"stylesheet\" type=\"text/css\" href=\"" + request.getBaseContext() + "/hui/css/msie7.css\"></link><![endif]-->");
		writer.write("<!--[if lt IE 7]><link rel=\"stylesheet\" type=\"text/css\" href=\"" + request.getBaseContext() + "/hui/css/msie6.css\"></link><![endif]-->");
		writer.write("<!--[if lt IE 9]><script type=\"text/javascript\" src=\"" + request.getBaseContext() + "/hui/bin/compatibility.min.js\"></script><![endif]-->");
	}
}
