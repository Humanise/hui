package dk.in2isoft.in2igui.data;

import java.util.HashMap;

public class FormulaData extends HashMap<String,Object> {

	private static final long serialVersionUID = 6511089170370248403L;

	public void addValue(String key,Object value) {
		this.put(key, value);
	}
}
