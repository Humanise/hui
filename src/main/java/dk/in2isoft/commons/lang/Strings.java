package dk.in2isoft.commons.lang;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Pattern;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;

import com.google.common.collect.Lists;
import com.google.gson.Gson;

import dk.in2isoft.onlineobjects.core.Pair;

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
	
	public static final String UNICODE_TRADEMARK = "\u2122";
	public static final String UNICODE_REGISTERED_TRADEMARK = "\u00AE";
	
	public static final String LEFT_DOUBLE_QUOTATION_MARK = "\u201C";
	public static final String RIGHT_DOUBLE_QUOTATION_MARK = "\u201D";

	public static final String LEFT_SINGLE_QUOTATION_MARK = "\u2018";
	public static final String RIGHT_SINGLE_QUOTATION_MARK = "\u2019";
	public static final String SINGLE_HIGH_REVERSED_9_QUOTATION_MARK = "\u201B";
	public static final String SINGLE_LOW_9_QUOTATION_MARK = "\u201A";
	public static final String DOUBLE_LOW_9_QUOTATION_MARK = "\u201E";
	
	public static final String[] ALPHABETH = {"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",Strings.UNICODE_AE,Strings.UNICODE_OE,Strings.UNICODE_AA};
	public static final String TRIANGLE_HEADED_RIGHTWARDS_ARROW = "\u279D";
	
	public static final Object RIGHTWARDS_ARROW = "\u2192";
	public static final String MIDDLE_DOT = "\u00B7";
	
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
	
	public static String deAccent(String str) {
		if (str==null) {
			return null;
		}
	    String nfdNormalizedString = Normalizer.normalize(str, Normalizer.Form.NFD); 
	    Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
	    return pattern.matcher(nfdNormalizedString).replaceAll("");
	}
	
	/**
	 * For use when indexing - has no other usage
	 * @param text
	 * @return
	 */
	public static String getAlphabethStartLetter(String text) {
		if (text==null) {
			return "none";
		}
		text = text.trim();
		if (text.length()==0) {
			return "none";
		}
		String letter = text.substring(0, 1).toLowerCase();
		if (Strings.contains(letter, ALPHABETH)) {
			return letter;
		}
		letter = deAccent(letter);
		if (Strings.contains(letter, ALPHABETH)) {
			return letter;
		}
		if (StringUtils.isNumeric(letter)) {
			return "number";
		}
		return "other";
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
	
	public static boolean isDefined(String[] strings) {
		return strings != null && strings.length > 0;
	}

	public static boolean isNotBlank(String str) {
		return StringUtils.isNotBlank(str);
	}
	
	public static boolean isBlank(String str) {
		return StringUtils.isBlank(str);
	}
	
	public static String fallback(String str, String defaultValue) {
		if (Strings.isBlank(str)) {
			return defaultValue;
		}
		return str;
	}

	public static String[] getWords(String query) {
		if (Strings.isBlank(query)) {
			return new String[] {};
		}
		return query.trim().split("\\s+");
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
			String encoded = URLEncoder.encode(string,"UTF-8");
			encoded = encoded.replaceAll("\\.", "%2E");
			return encoded;
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
	
	public static String getSimplifiedDomain(String url) {
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
		if (parts.length>0) {
			return parts[0];
		}
		return null;
	}

	public static String asNonNull(String string) {
		if (string==null) {
			return "";
		}
		return string;
	}

	public static String asNonBlank(String string,String blankValue) {
		if (isBlank(string)) {
			return blankValue;
		}
		return string;
	}

	public static boolean equals(String first, String second) {
		if (first==null && second==null) {
			return true;
		}
		if (first==null || second==null) {
			return false;
		}
		return first.equals(second);
	}

	public static String[] toArray(List<String> list) {
		return list.toArray(new String[] {});
	}

	public static String highlight(String text, String[] words) {
		if (text==null) {
			return null;
		}
		if (words==null || words.length==0) {
			return StringEscapeUtils.escapeXml(text);
		}
		// TODO Consider using a primitive array
		List<Pair<Integer,Integer>> positions = Lists.newArrayList(); 
		String lower = text.toLowerCase();
		for (int i = 0; i < words.length; i++) {
			String word = words[i].toLowerCase();
			int start = 0;
			while (start!=-1) {
				start = lower.indexOf(word,start);
				if (start!=-1) {
					int end = start+word.length();
					positions.add(Pair.of(start, end));
					start++;
				}
			}
		}
		if (positions.isEmpty()) {
			return text;
		}
		
		
		Collections.sort(positions, new Comparator<Pair<Integer,Integer>>() {

			@Override
			public int compare(Pair<Integer, Integer> o1, Pair<Integer, Integer> o2) {
				int comparison = o1.getKey().compareTo(o2.getKey());
				if (comparison==0) {
					return o2.getValue().compareTo(o1.getValue());
				}
				return comparison;
			}
			
		});

		StringBuilder out = new StringBuilder();
		int pos = 0;
		for (Pair<Integer, Integer> position : positions) {
			int from = position.getKey();
			int to = position.getValue();
			if (from >= pos) {
				String sub = text.substring(pos, from);
				out.append(StringEscapeUtils.escapeXml(sub));
				out.append("<em>");
				out.append(StringEscapeUtils.escapeXml(text.substring(from, to)));
				out.append("</em>");
				pos = to;
			}
			
		}
		out.append(text.substring(pos));
		return out.toString();
	}

	public static int compareCaseless(String a, String b) {
		if (a==null) a = "";
		if (b==null) b = "";
		return a.toLowerCase().compareTo(b.toLowerCase());
	}
	
	public static int getVisibleLength(String text) {
		if (text==null || text.length()==0) {
			return 0;
		}
		int length = 0;
        for (int i = 0; i < text.length(); i++) {
            if (Character.isWhitespace(text.charAt(i)) == false) {
                length++;
            }
        }
        return length;
	}

	public static boolean isInteger(String str) {
		return str!=null && str.matches("[-]?[0-9]+");
	}

}
