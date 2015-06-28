package dk.in2isoft.commons.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegExpUtil {
	
	public static String[] getGroups(String text,Pattern pattern) {
		Matcher matcher = pattern.matcher(text);
		if (matcher.find()) {
			int groups = matcher.groupCount();
			if (groups>0) {
				String[] found = new String[groups+1];
				for (int i = 0; i <= groups; i++) {
					found[i] = matcher.group(i);
				}
				return found;
			}
		}
		return null;		
	}
	
	public static String[] getGroups(String text,String expression) {
		Pattern pattern = Pattern.compile(expression);
		return getGroups(text, pattern);
	}
}
