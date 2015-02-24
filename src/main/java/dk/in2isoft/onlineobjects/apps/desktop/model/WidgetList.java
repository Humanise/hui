package dk.in2isoft.onlineobjects.apps.desktop.model;

import java.util.List;

import com.google.common.collect.Lists;

public class WidgetList {
	private List<WidgetListItem> items = Lists.newArrayList();

	public List<WidgetListItem> getItems() {
		return items;
	}

	public void setItems(List<WidgetListItem> items) {
		this.items = items;
	}
	
	public void addItem(WidgetListItem item) {
		items.add(item);
	}
}
