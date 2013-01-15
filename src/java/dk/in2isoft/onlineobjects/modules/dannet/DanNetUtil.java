package dk.in2isoft.onlineobjects.modules.dannet;

import org.apache.commons.lang.StringEscapeUtils;

import dk.in2isoft.commons.lang.Strings;

public class DanNetUtil {

	public static DanNetGlossary parseGlossary(String str) {
		DanNetGlossary output = new DanNetGlossary();
		str = StringEscapeUtils.unescapeHtml(str).trim();
		if (!"(ingen definition)".equals(str.toLowerCase())) { 
			if (str.contains("(Brug:")) {
				String[] parts = str.split("\\(Brug:");
				if (parts.length==2) {
					str = parts[0].trim();
					String usage = parts[1].trim();
					if (usage.startsWith("\"")) {
						usage = usage.substring(1);
					}
					if (usage.endsWith("\")")) {
						usage = usage.substring(0,usage.length()-2);
					}
					String[] examples;
					if (usage.contains("\"; \"")) {
						examples= usage.split("\";[ ]*\"");
					} else {
						examples= usage.split("\\|\\|");
					}
					for (String string : examples) {
						string = string.trim();
						if (Strings.isNotBlank(string)) {
							output.getExamples().add(string);
						}
					}
				}
			}
			output.setGlossary(str);
		}
		return output;
	}
}
