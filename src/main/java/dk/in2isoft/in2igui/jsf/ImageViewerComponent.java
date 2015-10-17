package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.in2igui.jsf.HUIComponent;

@FacesComponent(value=ImageViewerComponent.FAMILY)
@Dependencies(
		js = {"/hui/js/ImageViewer.js"},
		css = {"/hui/css/imageviewer.css"},
		requires = {HUIComponent.class}, uses = {BoxComponent.class}
	)
public class ImageViewerComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.photoviewer";
		
	public ImageViewerComponent() {
		super(FAMILY);
	}

	@Override
	public void restoreState(Object[] state) {
	}

	@Override
	public Object[] saveState() {
		return new Object[] { };
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
	}

}
