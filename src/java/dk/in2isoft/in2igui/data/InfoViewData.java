package dk.in2isoft.in2igui.data;

import java.util.ArrayList;
import java.util.Collection;

public class InfoViewData extends ArrayList<InfoViewDataItem> {

	private static final long serialVersionUID = 1L;

	public void addHeader(String text) {
		add(new InfoViewDataItem("header",null,text));
	}
	
	public void addProperty(String label, String text) {
		add(new InfoViewDataItem("property",label,text));
	}
	
	public void addObjects(String label, Collection<ObjectData> objects) {
		add(new InfoViewDataItem("objects",label,objects));
	}
}
