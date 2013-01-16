package dk.in2isoft.onlineobjects.ui.jsf;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.lang.Strings;

public class Functions {

	public static String json(Object object) {
		return Strings.toJSON(object);
	}

	public static String join(String one, String two) {
		return StringUtils.join(new String[] {one,two}, "");
	}

}
