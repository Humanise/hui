package dk.in2isoft.commons.lang;

import java.util.List;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.core.Pair;

public class TextDecorator {
	private List<Pair<String,Object>> highlighted = Lists.newArrayList();
	
	public void addHighlight(String str) {
		highlighted.add(Pair.of(str, null));
	}
	
	public String process(String text) {
		for (Pair<String, Object> pair : highlighted) {
			String replacement = "<em>" + pair.getKey() + "</em>";
			String expression = pair.getKey();
			expression = expression.replaceAll("[\\W]+", "[\\\\W]+");
			text = text.replaceAll(expression, replacement);
		}
		text = text.replaceAll("\n", "<br/>");
		return text;
	}
}
