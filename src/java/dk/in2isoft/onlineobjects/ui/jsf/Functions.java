package dk.in2isoft.onlineobjects.ui.jsf;

import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.ui.Request;

public class Functions {

	public static String json(Object object) {
		return Strings.toJSON(object);
	}

	public static String join(String one, String two) {
		return StringUtils.join(new String[] {one,two}, "");
	}

	public static boolean loggedIn() {
		return Request.get(FacesContext.getCurrentInstance()).isLoggedIn();
	}

}
