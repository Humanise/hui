package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.commons.lang.Strings;

@FacesComponent(value=UploadComponent.TYPE)
public class UploadComponent extends AbstractComponent {

	public static final String TYPE = "hui.upload";

	private String name;
	private String url;

	public UploadComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
		url = (String) state[1];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { name, url };
	}
	
	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		String id = getClientId();
		out.startDiv().withClass("hui_upload").withId(id);
		out.startDiv("hui_upload_items").endDiv();
		out.startDiv("hui_upload_status").endDiv();

		{ // Placeholder
			out.startDiv("hui_upload_placeholder");
			out.startSpan("hui_upload_icon").endSpan();
			out.startElement("h1").text("Upload something").endElement("h1");
			out.startP().text("Here you can upload something").endP();
			out.endDiv();
		}
		out.endDiv();
		
		// Script...
		out.startScopedScript();
		out.startNewObject("hui.ui.Upload");
		out.property("element", id);
		String name = getName(context);
		if (name!=null) {
			out.comma().property("name",name);
		}
		if (Strings.isNotBlank(url)) {
			out.comma().property("url",url);
		}
		out.endNewObject();
		
		out.endScopedScript();
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public String getName(FacesContext context) {
		return getExpression("name", name, context);
	}

	public void setUrl(String url) {
		this.url = url;
	}
	
	public String getUrl() {
		return url;
	}
}
