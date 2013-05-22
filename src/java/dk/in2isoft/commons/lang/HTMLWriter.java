package dk.in2isoft.commons.lang;

import java.io.PrintWriter;
import java.io.StringWriter;

import dk.in2isoft.in2igui.data.MarkupWriter;

public class HTMLWriter extends MarkupWriter {
	
	private StringWriter stringWriter;

	public HTMLWriter() {
		this.stringWriter = new StringWriter();
		writer = new PrintWriter(stringWriter);
	}

	public HTMLWriter startDiv() {
		startTag("div");
		return this;
	}

	public HTMLWriter endDiv() {
		endTag("div");
		return this;
	}
	
	public HTMLWriter startP() {
		startTag("p");
		return this;
	}

	public HTMLWriter endP() {
		endTag("p");
		return this;
	}
	
	public HTMLWriter startA() {
		startTag("a");
		return this;
	}
	
	public HTMLWriter startVoidA() {
		startTag("a");
		withAttribute("href", "javascript://");
		return this;
	}

	public HTMLWriter endA() {
		endTag("a");
		return this;
	}
	public HTMLWriter startH1() {
		startTag("h1");
		return this;
	}

	public HTMLWriter endH1() {
		endTag("h1");
		return this;
	}

	public HTMLWriter withHref(String href) {
		withAttribute("href", href);
		return this;
	}

	public HTMLWriter withClass(String clss) {
		withAttribute("class", clss);
		return this;
	}
	
	public HTMLWriter text(Object str) {
		if (str!=null) {
			text(str.toString());
		}
		return this;
	}


	@Override
	public String toString() {
		return stringWriter.toString();
	}

	public HTMLWriter withData(Object data) {
		withAttribute("data", Strings.toJSON(data));
		return this;
	}
}
