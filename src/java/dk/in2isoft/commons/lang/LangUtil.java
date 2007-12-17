package dk.in2isoft.commons.lang;

public class LangUtil {

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
}
