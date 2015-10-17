package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.in2igui.jsf.BarComponent;
import dk.in2isoft.in2igui.jsf.ButtonComponent;
import dk.in2isoft.in2igui.jsf.GalleryComponent;
import dk.in2isoft.in2igui.jsf.OverflowComponent;
import dk.in2isoft.in2igui.jsf.SourceComponent;
import dk.in2isoft.in2igui.jsf.WindowComponent;
import dk.in2isoft.onlineobjects.ui.Request;

@FacesComponent(FinderComponent.FAMILY)
@Dependencies(js = { "/WEB-INF/core/web/js/oo_finder.js" }, requires = { OnlineObjectsComponent.class}, uses = { WindowComponent.class, ButtonComponent.class, SourceComponent.class, OverflowComponent.class, GalleryComponent.class })
public class FinderComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.finder";
	
	private String name;
	
	public FinderComponent() {
		super(FAMILY);
	}

	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { name };
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		Request request = getRequest();
		
		out.startDiv().withId(getClientId());
		WindowComponent window = new WindowComponent();
		window.setName(name+"_window");
		window.setTitle("Find it!");
		window.setWidth(500);
		
		BarComponent bar = new BarComponent();
		bar.setVariant("window");
		window.add(bar);
		
		ButtonComponent addButton = new ButtonComponent();
		addButton.setText("Add images");
		addButton.setName(name+"_add");
		addButton.setSmall(true);
		bar.add(addButton);
		
		SourceComponent source = new SourceComponent();
		source.setName(name+"_source");
		source.setUrl(request.getLocalContext()+"/imageFinderGallery");
		
		window.add(source);
		
		OverflowComponent overflow = new OverflowComponent();
		overflow.setHeight(400);
		window.add(overflow);
		
		GalleryComponent gallery = new GalleryComponent();
		gallery.setName(name+"_gallery");
		gallery.setSource(source);
		overflow.add(gallery);
		
		window.encodeAll(context);
		
		out.endDiv();

		out.getScriptWriter().startScript().startNewObject("oo.Finder").property("name", name).comma().property("element", getClientId()).endNewObject().endScript();
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
}
