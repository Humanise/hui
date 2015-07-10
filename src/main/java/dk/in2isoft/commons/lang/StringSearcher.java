package dk.in2isoft.commons.lang;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.google.common.collect.Lists;

public class StringSearcher {

	public List<Result> search(String find, String text) {
		List<Result> results = Lists.newArrayList();
		String query = find.replaceAll("[\\n\\t ]+", "[\\\\n\\\\t ]*");
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
