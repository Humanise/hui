package dk.in2isoft.commons.jsf;

import java.io.IOException;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringEscapeUtils;

public class TagWriter {

	private ResponseWriter writer;
	private UIComponent component;
	private ScriptWriter scriptWriter;

	public TagWriter(UIComponent component, FacesContext context) {
		super();
		this.writer = context.getResponseWriter();
		this.component = component;
		HttpServletRequest request = (HttpServletRequest) context.getExternalContext().getRequest();
		String scriptHeader = request.getHeader("OnlineObjects-Scripts");
		if ("united".equals(scriptHeader) || context.getPartialViewContext().isAjaxRequest()) {
			this.scriptWriter = new ScriptWriter(this.writer);
		} else {
			this.scriptWriter = Components.getScriptWriter(context);
		}
	}
	
	public ScriptWriter getScriptWriter() {
		return scriptWriter;
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
	
	public TagWriter withSrc(Object src) throws IOException {
		return withAttribute("src", src);
	}
	
	public TagWriter withStyle(Object style) throws IOException {
		return withAttribute("style", style);
	}

	public TagWriter data(Object data) throws IOException {
		return withAttribute("data", data);
	}

	public TagWriter alt(Object alt) throws IOException {
		return withAttribute("alt", alt);
	}

	public TagWriter rel(Object rel) throws IOException {
		return withAttribute("rel", rel);
	}

	public TagWriter type(Object type) throws IOException {
		return withAttribute("type", type);
	}

	public TagWriter src(Object rel) throws IOException {
		return withAttribute("src", rel);
	}

	public TagWriter write(Object text) throws IOException {
		if (text!=null) {
			writer.write(text.toString());
		}
		return this;
	}

	public TagWriter writeScriptString(Object text) throws IOException {
		if (text!=null) {
			writer.write(StringEscapeUtils.escapeJavaScript(text.toString()));
		}
		return this;
	}

	public TagWriter text(Object text) throws IOException {
		if (text!=null) {
			writer.writeText(text.toString(),null);
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
	
	public TagWriter startVoidA() throws IOException {
		return startElement("a").withAttribute("href","javascript:void(0);");
	}

	public TagWriter endA() throws IOException {
		return endElement("a");
	}
	
	/////////// LISTS /////////

	public TagWriter startOl() throws IOException {
		return startElement("ol");
	}

	public TagWriter startOl(Object className) throws IOException {
		return startElement("ol").withClass(className);
	}

	public TagWriter endOl() throws IOException {
		return endElement("ol");
	}

	public TagWriter startUl() throws IOException {
		return startElement("ul");
	}

	public TagWriter startUl(Object className) throws IOException {
		return startElement("ul").withClass(className);
	}

	public TagWriter endUl() throws IOException {
		return endElement("ul");
	}

	public TagWriter startP() throws IOException {
		return startElement("p");
	}

	public TagWriter startP(Object className) throws IOException {
		return startElement("p").withClass(className);
	}

	public TagWriter endP() throws IOException {
		return endElement("p");
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
	
	/////////// I //////////
	
	public TagWriter startI() throws IOException {
		return startElement("i");
	}

	public TagWriter startI(Object className) throws IOException {
		return startElement("i").withClass(className);
	}
	
	public TagWriter endI() throws IOException {
		return endElement("i");
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
	
	/////////// IMG //////////
	
	public TagWriter startImg() throws IOException {
		return startElement("img");
	}

	public TagWriter startImg(Object className) throws IOException {
		return startElement("img").withClass(className);
	}
	
	public TagWriter endImg() throws IOException {
		return endElement("img");
	}
	
	/////////// DIV //////////
	
	public TagWriter startDiv() throws IOException {
		return startElement("div");
	}
	
	public TagWriter startDiv(Object className) throws IOException {
		return startElement("div").withClass(className);
	}
	
	public TagWriter endDiv() throws IOException {
		return endElement("div");
	}

	/////////// INPUT //////////

	public TagWriter startInput() throws IOException {
		return startElement("input");
	}
		
	public TagWriter endInput() throws IOException {
		return endElement("input");
	}
	
	////////// SCRIPT ////////
	
	public TagWriter startScript() throws IOException {
		startElement("script").withAttribute("type", "text/javascript");
		return this;
	}

	public TagWriter endScript() throws IOException {
		return endElement("script");
	}
	
	public TagWriter startScopedScript() throws IOException {
		startElement("script").withAttribute("type", "text/javascript");
		write("\n(function() {\n");
		return this;
	}

	public TagWriter endScopedScript() throws IOException {
		write("\n})();\n");
		return endElement("script");
	}

	public TagWriter newLine() throws IOException {
		return write("\n");
	}

	public TagWriter writeStylesheet(Object href) throws IOException {
		startElement("link").withAttribute("rel", "stylesheet").withAttribute("type", "text/css").withAttribute("charset", "utf-8");
		withAttribute("href", href);
		endElement("link");
		return this;
	}

	public TagWriter writeScript(Object src) throws IOException {
		
		startElement("script").withAttribute("type", "text/javascript").withAttribute("charset", "utf-8");
		withAttribute("src", src);
		endElement("script");
		return this;
	}

	public TagWriter line() throws IOException {
		return write("\n");
	}

	public TagWriter comma() throws IOException {
		return write(",");
	}
	/*

	public TagWriter startNewObject(String name) throws IOException {
		return write("new ").write(name).write("({");
	}

	public TagWriter property(String name, String value) throws IOException {
		return write("'").write(name).write("':'").write(StringEscapeUtils.escapeJavaScript(value)).write("'");
	}

	public TagWriter startObjectProperty(String name) throws IOException {
		return write("'").write(name).write("':{");
	}

	public TagWriter endObjectProperty() throws IOException {
		return write("}");
	}

	public TagWriter propertyRaw(String name, String value) throws IOException {
		return write("'").write(name).write("':").write(value);
	}

	public TagWriter property(String name, boolean value) throws IOException {
		return write("'").write(name).write("':").write(value);
	}

	public TagWriter property(String name, int value) throws IOException {
		return write("'").write(name).write("':").write(value);
	}

	public TagWriter property(String name, double value) throws IOException {
		return write("'").write(name).write("':").write(value);
	}


	public TagWriter property(String name, Double value) throws IOException {
		return write("'").write(name).write("':").write(value==null ? "null" : value);
	}
	
	public TagWriter endNewObject() throws IOException {
		return write("})");
	}
	*/

	public void flush() throws IOException {
		this.writer.flush();
	}

	public TagWriter href(String url) throws IOException {
		return withHref(url);
	}

}
