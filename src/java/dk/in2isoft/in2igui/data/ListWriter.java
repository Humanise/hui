package dk.in2isoft.in2igui.data;

import java.io.IOException;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.ui.Request;

public class ListWriter extends MarkupWriter {

	private Request request;
	
	
	public ListWriter(Request request) throws IOException {
		super(request.getResponse().getWriter());
		this.request = request;
	}
	
	public ListWriter startList() {
		request.getResponse().setContentType("text/xml");
		request.getResponse().setCharacterEncoding(Strings.UTF8);
		writer.write("<?xml version=\"1.0\"?>");
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

	public ListWriter icon(String icon) {
		startTag("icon");
		withAttribute("icon", icon);
		endTag("icon");
		return this;
	}

	public ListWriter text(Object str) {
		if (str!=null) {
			text(str.toString());
		}
		return this;
	}

	public ListWriter endCell() {
		endTag("cell");
		return this;
	}

	public ListWriter withId(Object id) {
		withAttribute("id", id);
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
}
