package dk.in2isoft.in2igui.data;

import java.util.ArrayList;

public class ListObjects extends ArrayList<ListDataRow> {

	private static final long serialVersionUID = 1L;

	public void addRow(ListDataRow row) {
		super.add(row);
	}
}
