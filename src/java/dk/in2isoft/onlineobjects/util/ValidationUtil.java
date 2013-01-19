package dk.in2isoft.onlineobjects.util;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.validator.routines.EmailValidator;

public class ValidationUtil {
	
	public static boolean isWellFormedEmail(String email) {
		return EmailValidator.getInstance().isValid(email);
	}
	
	public static boolean isValidUsername(String username) {
		if ("core".equals(username) || "app".equals(username) || "service".equals(username) || "dwr".equals(username) || "hui".equals(username)) {
			return false;
		}
		return StringUtils.containsOnly(username, "abcdefghijklmnopqrstuvwxyz0123456789");
	}
}
