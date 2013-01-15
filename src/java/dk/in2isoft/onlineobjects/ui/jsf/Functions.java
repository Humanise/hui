package dk.in2isoft.onlineobjects.ui.jsf;

import dk.in2isoft.commons.lang.Strings;

public class Functions {

	public static String json(Object object) {
		return Strings.toJSON(object);
	}
}
