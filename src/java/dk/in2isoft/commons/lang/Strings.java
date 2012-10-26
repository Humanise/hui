package dk.in2isoft.commons.lang;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;

public class Strings {

	public static final String DEGREE = "\u00B0";
	public static final String RIGHT_SINGLE_QUOTE = "\u2019";
	public static final String DOUBLE_APOSTROPHE = "\u02EE";
	
	
	// private static Logger log = Logger.getLogger(LangUtil.class);

	public static String concatWords(String first, String second) {
		if (first == null && second == null) {
			return null;
		} else if (first != null && second == null) {
			return first;
		} else if (first == null && second != null) {
			return second;
		} else {
			return first + " " + second;
		}
	}

	public static String concatWords(String[] words) {
		StringBuilder str = new StringBuilder();
		for (int i = 0; i < words.length; i++) {
			if (words[i] != null) {
				String word = words[i].trim();
				if (word.length() > 0) {
					if (str.length() > 0) {
						str.append(" ");
					}
					str.append(word);
				}
			}
		}
		return str.toString();
	}

	public static String implode(String[] array, String delimiter) {
		if (array.length == 0) {
			return "";
		} else if (array.length == 1) {
			return array[0];
		} else {
			StringBuilder str = new StringBuilder();
			for (int i = 0; i < array.length; i++) {
				if (i > 0)
					str.append(delimiter);
				str.append(array[i]);
			}
			return str.toString();
		}
	}

	public static String generateRandomString(int n) {
		char[] pw = new char[n];
		int c = 'A';
		int r1 = 0;
		for (int i = 0; i < n; i++) {
			r1 = (int) (Math.random() * 3);
			switch (r1) {
			case 0:
				c = '0' + (int) (Math.random() * 10);
				break;
			case 1:
				c = 'a' + (int) (Math.random() * 26);
				break;
			case 2:
				c = 'A' + (int) (Math.random() * 26);
				break;
			}
			pw[i] = (char) c;
		}
		return new String(pw);
	}

	public static boolean isDefined(String str) {
		return (str!=null && str.trim().length()>0);
	}

	public static boolean isDefined(String[] words) {
		return words != null && words.length > 0;
	}

	public static boolean isNotBlank(String str) {
		return StringUtils.isNotBlank(str);
	}
	
	public static boolean isBlank(String str) {
		return StringUtils.isBlank(str);
	}

	public static String[] getWords(String query) {
		return query.trim().split("\\W+");
	}

	public static String[] combine(Object... strings) {
		String[] combined = {};
		for (int i = 0; i < strings.length; i++) {
			Object obj = strings[i];
			if (obj instanceof String[]) {
				combined = (String[]) ArrayUtils.addAll(combined, (Object[]) strings[i]);
			} else {
				combined = (String[]) ArrayUtils.add(combined, obj.toString());
			}
		}
		return combined;
	}

}
