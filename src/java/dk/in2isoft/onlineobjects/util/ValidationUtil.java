package dk.in2isoft.onlineobjects.util;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.validator.EmailValidator;

public class ValidationUtil {
	
	public static boolean isWellFormedEmail(String email) {
		return EmailValidator.getInstance().isValid(email);
	}
	
	public static boolean isValidUsername(String username) {
		return StringUtils.containsOnly(username, "abcdefghijklmnopqrstuvwxyz0123456789");
	}
}
