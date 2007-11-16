package dk.in2isoft.commons.lang;



public class LangUtil {

	//private static Logger log = Logger.getLogger(LangUtil.class);

	public static String concatWords(String first,String second) {
		if (first==null && second==null) {
			return null;
		} else if (first!=null && second==null) {
			return first;
		} else if (first==null && second!=null) {
			return second;
		} else {
			return first+" "+second;
		}
	}
	
	public static String concatWords(String[] words) {
		StringBuilder str = new StringBuilder();
		for (int i = 0; i < words.length; i++) {
			if (words[i]!=null) {
				if (str.length()>0) {
					str.append(" ");
				}
				str.append(words[i].trim());
			}
		}
		return str.toString();
	}
}
