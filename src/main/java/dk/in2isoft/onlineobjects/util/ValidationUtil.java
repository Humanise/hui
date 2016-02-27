package dk.in2isoft.onlineobjects.util;

import java.net.URI;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.validator.routines.EmailValidator;

import dk.in2isoft.commons.lang.Strings;

public class ValidationUtil {
	
	private static final Pattern PASSWORD = Pattern.compile("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$");
	
	public static boolean isWellFormedEmail(String email) {
		return EmailValidator.getInstance().isValid(email);
	}
	
	public static boolean isValidUsername(String username) {
		if (Strings.isBlank(username)) {
			return false;
		}
		if ("core".equals(username) || "app".equals(username) || "service".equals(username) || "dwr".equals(username) || "hui".equals(username)) {
			return false;
		}
		return StringUtils.containsOnly(username, "abcdefghijklmnopqrstuvwxyz0123456789");
	}

	public static boolean isValidPassword(String password) {
		if (password==null) {
			return false;
		}
		return PASSWORD.matcher(password).matches();
	}

	public static boolean isWellFormedURI(String str) {
		try {
			URI.create(str);
			return true;
		} catch (Exception e) {
			
		}
		return false;
	}
}
