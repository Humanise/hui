package dk.in2isoft.in2igui.data;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.ui.Request;

public class ListWriter extends MarkupWriter {
	
	
	public ListWriter(Request request) throws IOException {
		HttpServletResponse response = request.getResponse();
		response.setCharacterEncoding(Strings.UTF8);
		response.setContentType("text/xml");
		this.writer = response.getWriter();
	}
	
	public ListWriter startList() {
		writer.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
		startTag("list");
		return this;
	}

	public ListWriter endList() {
		endTag("list");
		return this;
	}
	
	public ListWriter window(int total, int size, int page) {
		startTag("window");
		withAttribute("total", total);
		withAttribute("size", size);
		withAttribute("page", page);
		endTag("window");
		return this;
	}

	public ListWriter startHeaders() {
		startTag("headers");
		return this;
	}

	public ListWriter endHeaders() {
		endTag("headers");
		return this;
	}

	public ListWriter header(String text) {
		startTag("header");
		withAttribute("title", text);
		endTag("header");
		return this;
	}
	
	public ListWriter header(String text, int width) {
		startTag("header");
		withAttribute("title", text);
		withAttribute("width", width);
		endTag("header");
		return this;
	}

	public ListWriter startRow() {
		startTag("row");
		return this;
	}

	public ListWriter endRow() {
		endTag("row");
		return this;
	}
	
	public ListWriter startCell() {
		startTag("cell");
		return this;
	}

	public ListWriter endCell() {
		endTag("cell");
		return this;
	}

	public ListWriter startIcons() {
		startTag("icons");
		return this;
	}

	public ListWriter endIcons() {
		endTag("icons");
		return this;
	}
	
	public ListWriter startIcon() {
		startTag("icon");
		return this;
	}
	
	public ListWriter startActionIcon(String icon) {
		startTag("icon");
		withAttribute("icon", icon);
		
		withAttribute("action", true);
		return this;
	}

	public ListWriter endIcon() {
		endTag("icon");
		return this;
	}
	
	public ListWriter startLine() {
		startTag("line");
		return this;
	}

	public ListWriter startMinorLine() {
		startTag("line");
		withAttribute("minor", true);
		return this;
	}

	public ListWriter endLine() {
		endTag("line");
		return this;
	}

	public ListWriter startWrap() {
		startTag("wrap");
		return this;
	}

	public ListWriter endWrap() {
		endTag("wrap");
		return this;
	}

	public ListWriter icon(String icon) {
		startTag("icon");
		withAttribute("icon", icon);
		endTag("icon");
		return this;
	}

	public ListWriter text(Object str) throws IOException {
		if (str!=null) {
			text(str.toString());
		}
		return this;
	}

	public ListWriter withId(Object id) {
		withAttribute("id", id);
		return this;
	}

	public ListWriter withData(Object data) {
		if (data!=null) {
			withAttribute("data", Strings.toJSON(data));
		}
		return this;
	}

	public ListWriter withKind(String kind) {
		withAttribute("kind", kind);
		return this;
	}

	public ListWriter withIcon(String icon) {
		withAttribute("icon", icon);
		return this;
	}

	public ListWriter nowrap() {
		withAttribute("wrap", false);
		return this;
	}

	public ListWriter dimmed() {
		withAttribute("dimmed", true);
		return this;
	}

	public ListWriter minor() {
		withAttribute("minor", true);
		return this;
	}

	public ListWriter progress(float progress) {
		startTag("progress");
		withAttribute("value", progress);
		endTag("progress");
		return this;
	}

	public ListWriter withAction() {
		withAttribute("action", true);
		return this;
	}
	
	public ListWriter revealing() {
		withAttribute("revealing", true);
		return this;
	}

	public ListWriter cell(Object text) {
		startCell();
		if (text!=null) {
			text(text.toString());
		}
		endCell();
		return this;
	}

	public ListWriter html(Object text) {
		startTag("html");
		withAttribute("xmlns", "http://www.w3.org/1999/xhtml");
		if (text!=null) {
			raw(text.toString());
		}
		endTag("html");
		return this;
	}
}
