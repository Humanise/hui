package dk.in2isoft.commons.lang;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.google.common.collect.Lists;

public class StringSearcher {
	
	private static Pattern SPECIAL_REGEX_CHARS = Pattern.compile("[{}()\\[\\].+*?^$\\\\|]");
	
	private static String[] WHITESPACE = {       /* dummy empty string for homogeneity */
            "\\u0009", // CHARACTER TABULATION
            "\\u000A", // LINE FEED (LF)
            "\\u000B", // LINE TABULATION
            "\\u000C", // FORM FEED (FF)
            "\\u000D", // CARRIAGE RETURN (CR)
            "\\u0020", // SPACE
            "\\u0085", // NEXT LINE (NEL) 
            "\\u00A0", // NO-BREAK SPACE
            "\\u1680", // OGHAM SPACE MARK
            "\\u180E", // MONGOLIAN VOWEL SEPARATOR
            "\\u2000", // EN QUAD 
            "\\u2001", // EM QUAD 
            "\\u2002", // EN SPACE
            "\\u2003", // EM SPACE
            "\\u2004", // THREE-PER-EM SPACE
            "\\u2005", // FOUR-PER-EM SPACE
            "\\u2006", // SIX-PER-EM SPACE
            "\\u2007", // FIGURE SPACE
            "\\u2008", // PUNCTUATION SPACE
            "\\u2009", // THIN SPACE
            "\\u200A", // HAIR SPACE
            "\\u2028", // LINE SEPARATOR
            "\\u2029", // PARAGRAPH SEPARATOR
            "\\u202F", // NARROW NO-BREAK SPACE
            "\\u205F", // MEDIUM MATHEMATICAL SPACE
            "\\u3000" // IDEOGRAPHIC SPACE
	};
	
	String search;
	String replace;
	
	public StringSearcher() {
		search = "[\\n\\t, ";
		replace = "[\\\\n\\\\t, ";
		for (String chr : WHITESPACE) {
			search+=chr;
			replace+="\\"+chr;
		}
		search+="]+";
		replace+="]*";
	}

	public List<Result> search(String find, String text) {
		List<Result> results = Lists.newArrayList();
		String query = SPECIAL_REGEX_CHARS.matcher(find).replaceAll("\\\\$0");;
		query = query.replaceAll(search, replace);
		//query = query.replaceAll("[\\n\\t ]+", "[\\\\n\\\\t ]*");
		Pattern pattern = Pattern.compile(query);
		Matcher matcher = pattern.matcher(text);
		while (matcher.find()) {
			int start = matcher.start();
			int end = matcher.end();
			String str = matcher.group();
			results.add(new Result(start,end,str));
		}
		return results;
	}

	public List<Result> findWords(String find, String text) {
		List<Result> results = Lists.newArrayList();
		String query = SPECIAL_REGEX_CHARS.matcher(find).replaceAll("\\\\$0");;
		query = "\\b" + query + "\\b";
		Pattern pattern = Pattern.compile(query);
		Matcher matcher = pattern.matcher(text);
		while (matcher.find()) {
			int start = matcher.start();
			int end = matcher.end();
			String str = matcher.group();
			results.add(new Result(start,end,str));
		}
		return results;
	}
	
	public class Result {
		private int from;
		private int to;
		private String text;
		
		protected Result(int from, int to, String text) {
			this.from = from;
			this.to = to;
			this.text = text;
		}
		
		public int getFrom() {
			return from;
		}
		
		public int getTo() {
			return to;
		}
		
		public String getText() {
			return text;
		}
	}
}
