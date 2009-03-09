package dk.in2isoft.commons.util;

import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;

public class RestUtil {

	public static boolean matches(String pattern,String subject) {
		return compile(pattern).matcher(subject).matches();
	}
	
	public static Pattern compile(String pattern) {
		pattern = StringUtils.replace(pattern, "<username>", "[a-z0-9_]+");
		pattern = StringUtils.replace(pattern, "<integer>", "[0-9]+");
		pattern = StringUtils.replace(pattern, "<letters>", "[a-z]+");
		return Pattern.compile(pattern);
	}
}
