package dk.in2isoft.commons.jsf;

import java.io.IOException;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;

public class TagWriter {

	private ResponseWriter writer;
	private UIComponent component;

	public TagWriter(UIComponent component, FacesContext context) {
		super();
		this.writer = context.getResponseWriter();
		this.component = component;
	}
	
	public TagWriter startElement(String name) throws IOException {
		writer.startElement(name, component);
		return this;
	}
	
	public TagWriter endElement(String name) throws IOException {
		writer.endElement(name);
		return this;
	}
	
	public TagWriter withAttribute(String name,Object value) throws IOException {
		writer.writeAttribute(name, value, null);
		return this;
	}
	
	public TagWriter withClass(Object className) throws IOException {
		return withAttribute("class", className);
	}
	
	public TagWriter withId(Object id) throws IOException {
		return withAttribute("id", id);
	}
	
	public TagWriter withHref(Object id) throws IOException {
		return withAttribute("href", id);
	}
	
	public TagWriter withStyle(String style) throws IOException {
		return withAttribute("style", style);
	}

	public TagWriter write(Object text) throws IOException {
		if (text!=null) {
			writer.write(text.toString());
		}
		return this;
	}
	
	///////// A /////////
	
	public TagWriter startA() throws IOException {
		return startElement("a");
	}
	
	public TagWriter startA(Object className) throws IOException {
		return startElement("a").withClass(className);
	}
	
	public TagWriter startVoidA(Object className) throws IOException {
		return startElement("a").withAttribute("href","javascript:void(0);").withClass(className);
	}

	public TagWriter endA() throws IOException {
		return endElement("a");
	}
	
	/////////// LISTS /////////

	public TagWriter startOl() throws IOException {
		return startElement("ol");
	}

	public TagWriter startOl(String className) throws IOException {
		return startElement("ol").withClass(className);
	}

	public TagWriter endOl() throws IOException {
		return endElement("ol");
	}

	public TagWriter startUl() throws IOException {
		return startElement("ul");
	}

	public TagWriter startUl(String className) throws IOException {
		return startElement("ul").withClass(className);
	}

	public TagWriter endUl() throws IOException {
		return endElement("ul");
	}

	public TagWriter startLi() throws IOException {
		return startElement("li");
	}

	public TagWriter startLi(String className) throws IOException {
		return startElement("li").withClass(className);
	}

	public TagWriter endLi() throws IOException {
		return endElement("li");
	}
	
	/////////// SPAN //////////
	
	public TagWriter startSpan() throws IOException {
		return startElement("span");
	}

	public TagWriter startSpan(Object className) throws IOException {
		return startElement("span").withClass(className);
	}
	
	public TagWriter endSpan() throws IOException {
		return endElement("span");
	}
	
	/////////// Strong //////////
	
	public TagWriter startStrong() throws IOException {
		return startElement("strong");
	}

	public TagWriter startStrong(Object className) throws IOException {
		return startElement("strong").withClass(className);
	}
	
	public TagWriter endStrong() throws IOException {
		return endElement("strong");
	}
	
	/////////// EM //////////
	
	public TagWriter startEm() throws IOException {
		return startElement("em");
	}

	public TagWriter startEm(Object className) throws IOException {
		return startElement("em").withClass(className);
	}
	
	public TagWriter endEm() throws IOException {
		return endElement("em");
	}
	
	/////////// SPAN //////////
	
	public TagWriter startDiv() throws IOException {
		return startElement("div");
	}
	
	public TagWriter startDiv(Object className) throws IOException {
		return startElement("div").withClass(className);
	}
	
	public TagWriter endDiv() throws IOException {
		return endElement("div");
	}

	////////// SCRIPT ////////
	
	public TagWriter startScopedScript() throws IOException {
		startElement("script").withAttribute("type", "text/javascript");
		write("(function() {");
		return this;
	}

	public TagWriter endScopedScript() throws IOException {
		write("})();");
		return endElement("script");
	}

}
