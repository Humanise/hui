package dk.in2isoft.in2igui;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public abstract class AbstractInterface implements Interface {

	private List<Widget> widgets = new ArrayList<Widget>();

	public void render(HttpServletRequest request,HttpServletResponse response) throws IOException {
		File file = getFile();
		if (file != null) {
			In2iGui.getInstance().render(file, request, response);
		} else {
			StringBuilder gui = new StringBuilder();
			gui.append("<gui xmlns='uri:In2iGui' context='../../../../'>");
			assemble(gui);
			gui.append("</gui>");
			In2iGui.getInstance().render(gui.toString(), request,response);
		}
	}

	public File getFile() {
		return null;
	}

	public AbstractInterface add(Widget widget) {
		widgets.add(widget);
		return this;
	}

	public void assemble(StringBuilder gui) {
		for (Widget widget : widgets) {
			widget.assemble(gui);
		}
	}
}
