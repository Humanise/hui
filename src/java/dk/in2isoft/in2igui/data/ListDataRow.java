package dk.in2isoft.in2igui.data;

import java.util.HashMap;

public class ListDataRow extends HashMap<String, Object> {

	private static final long serialVersionUID = 1L;

	public ListDataRow addColumn(String key,Object value) {
		super.put(key, value);
		return this;
	}
}
