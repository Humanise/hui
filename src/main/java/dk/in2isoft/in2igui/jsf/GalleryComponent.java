package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=GalleryComponent.TYPE)
public class GalleryComponent extends AbstractComponent {

	public static final String TYPE = "hui.gallery";

	private String name;
	private String source;

	public GalleryComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
		source = (String) state[1];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
			name, source
		};
	}
	
	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		
		
		String id = getClientId();
		
		out.startDiv("hui_gallery").withId(id).
			startDiv("hui_gallery_progress").endDiv().
			startDiv("hui_gallery_body").endDiv().
		endDiv();
		
		out.startScript();
		out.startNewObject("hui.ui.Gallery").property("element", id);
		if (name!=null) {
			out.comma().property("name", name);
		}
		if (source!=null) {
			out.comma().propertyRaw("source", "hui.ui.get('"+source+"')");
		}
		out.endNewObject();
		out.endScript();
	}
	
	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}
	
	public String getSource() {
		return source;
	}
	
	public void setSource(String source) {
		this.source = source;
	}
	
	public void setSource(SourceComponent source) {
		this.source = source.getName();
	}
}
