package dk.in2isoft.onlineobjects.ui.data;

import java.util.HashMap;

public class Data extends HashMap<String,Object> {
	
	private static final long serialVersionUID = 6406213425181190294L;

	public Data add(String key, Object value) {
		put(key, value);
		return this;
	}

	public static Data of(String key, Object value) {
		Data data = new Data();
		data.put(key, value);
		return data;
	}
}
