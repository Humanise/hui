package dk.in2isoft.onlineobjects.ui.data;

import java.util.List;

public class ViewResult {
	private List<?> items;
	private int total;
	public List<?> getItems() {
		return items;
	}
	public void setItems(List<?> items) {
		this.items = items;
	}
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
}
