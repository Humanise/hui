package dk.in2isoft.commons.lang;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;

import com.google.gson.Gson;

public class Strings {

	public static final Object ISO_8859_1 = "ISO-8859-1";
	public static final String UTF8 = "UTF-8";

	public static final String DEGREE = "\u00B0";
	public static final String RIGHT_SINGLE_QUOTE = "\u2019";
	public static final String DOUBLE_APOSTROPHE = "\u02EE";

	public static final String UNICODE_AA_LARGE = "\u00C5";
	public static final String UNICODE_AA = "\u00E5";
	
	public static final String UNICODE_AE_LARGE = "\u00C6";
	public static final String UNICODE_AE = "\u00E6";
	
	public static final String UNICODE_OE_LARGE = "\u00D8";
	public static final String UNICODE_OE = "\u00F8";
	
	public static final String[] ALPHABETH = {"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",Strings.UNICODE_AE,Strings.UNICODE_OE,Strings.UNICODE_AA};
	public static final Object RIGHT_ARROW = "\u279D";
	
	
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

	public static String concatWords(String... words) {
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

	public static String decodeURL(String string) {
		try {
			return URLDecoder.decode(string,"UTF-8");
		} catch (UnsupportedEncodingException e) {
			
		}
		return string;
	}

	public static String encodeURL(String string) {
		try {
			return URLEncoder.encode(string,"UTF-8");
		} catch (UnsupportedEncodingException e) {
			
		}
		return string;
	}

	public static List<String> asList(String[] strings) {
		List<String> list = new ArrayList<String>();
		for (String string : strings) {
			list.add(string);
		}
		return list;
	}

	public static boolean contains(String find, String[] sentences) {
		for (String item : sentences) {
			if (find.equals(item)) {
				return true;
			}
		}
		return false;
	}
	
	public static String toJSON(Object object) {
		Gson gson = new Gson();
		return gson.toJson(object);
	}
	
	public static String simplifyURL(String url) {
		if (Strings.isBlank(url)) {
			return "";
		}
		if (url.indexOf("?")!=-1) {
			url = url.substring(0,url.indexOf("?"));
		}
		if (url.indexOf("#")!=-1) {
			url = url.substring(0,url.indexOf("#"));
		}

		url = url.trim();
		url = url.replaceFirst("^[a-z]+://", "");
		url = url.replaceFirst("^www\\.", "");
		String[] parts = url.split("/");
		StringBuilder simplified = new StringBuilder();
		
		for (int i = 0; i < parts.length; i++) {
			if (i==0) {
				simplified.append(parts[i]);
			} else if (i==parts.length-1) {
				simplified.append(" : ");
				String part = parts[i];
				simplified.append(Strings.decodeURL(part).trim());
			}
		}
		
		return simplified.toString();
	}

	public static String asNonNull(String string) {
		if (string==null) {
			return "";
		}
		return string;
	}
}
