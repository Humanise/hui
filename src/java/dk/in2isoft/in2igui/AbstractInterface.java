package dk.in2isoft.in2igui;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import dk.in2isoft.onlineobjects.services.FileService;

public abstract class AbstractInterface implements Interface {

	private List<Widget> widgets = new ArrayList<Widget>();
	private Map<String,Object> parameters = new HashMap<String, Object>();

	public void render(HttpServletRequest request,HttpServletResponse response) throws IOException {
		File file = getFile();
		if (file != null && parameters.isEmpty()) {
			In2iGui.getInstance().render(file, request, response);
		} else if (file != null && !parameters.isEmpty()) {
			String string = FileService.readTextUTF8(file);
			
			for (Entry<String, Object> entry : parameters.entrySet()) {
				String name = "\\{"+entry.getKey()+"\\}";
				String value = entry.getValue()!=null ? entry.getValue().toString() : "";
				string = string.replaceAll(name, value);
			}
			In2iGui.getInstance().render(string, request, response);
		} else {
			StringBuilder gui = new StringBuilder();
			gui.append("<gui xmlns='uri:hui' context='../../../../'>");
			assemble(gui);
			gui.append("</gui>");
			In2iGui.getInstance().render(gui.toString(), request,response);
		}
	}
	
	public void setParameter(String name, Object value) {
		parameters.put(name, value);
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
