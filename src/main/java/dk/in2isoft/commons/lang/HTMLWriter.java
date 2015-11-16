package dk.in2isoft.commons.lang;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Map;

import com.google.common.collect.Maps;

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

	public HTMLWriter startUl() {
		startTag("ul");
		return this;
	}

	public HTMLWriter endUl() {
		endTag("ul");
		return this;
	}


	public HTMLWriter startLi() {
		startTag("li");
		return this;
	}

	public HTMLWriter endLi() {
		endTag("li");
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

	public HTMLWriter startBlockquote() {
		startTag("blockquote");
		return this;
	}
	
	public HTMLWriter endBlockquote() {
		endTag("blockquote");
		return this;
	}

	public HTMLWriter startStrong() {
		startTag("strong");
		return this;
	}

	public HTMLWriter endStrong() {
		endTag("strong");
		return this;
	}
	
	public HTMLWriter startSpan() {
		startTag("span");
		return this;
	}

	public HTMLWriter endSpan() {
		endTag("span");
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
	public HTMLWriter startH2() {
		startTag("h2");
		return this;
	}

	public HTMLWriter endH2() {
		endTag("h2");
		return this;
	}

	public HTMLWriter startH3() {
		startTag("h3");
		return this;
	}

	public HTMLWriter endH3() {
		endTag("h3");
		return this;
	}

	public HTMLWriter withHref(Object href) {
		
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
	
	public HTMLWriter html(String str) {
		raw(str);
		return this;
	}


	@Override
	public String toString() {
		return stringWriter.toString();
	}

	public HTMLWriter withData(Object data) {
		String value = data !=null && data instanceof String ? data.toString() : Strings.toJSON(data); 
		withAttribute("data", value);
		return this;
	}

	public HTMLWriter withDataMap(Object... data) {
		return withData(buildData(data));
	}
	
	private Map<String, Object> buildData(Object... parts) {
		Map<String, Object> data = Maps.newLinkedHashMap();
		for (int i = 0; i < parts.length; i++) {
			if (parts[i]!=null && i + 1 < parts.length) {
				data.put(parts[i].toString(), parts[i+1]);
			}
			i++;
		}
		return data;
	}

	public HTMLWriter withData(String name,Object data) {
		String value = data !=null && data instanceof String ? data.toString() : Strings.toJSON(data); 
		withAttribute("data-"+name, value);
		return this;
	}

	public HTMLWriter withTitle(Object value) {
		withAttribute("title", value);
		return this;
	}
}
