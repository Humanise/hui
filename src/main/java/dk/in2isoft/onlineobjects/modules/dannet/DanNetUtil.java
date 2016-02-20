package dk.in2isoft.onlineobjects.modules.dannet;

import org.apache.commons.lang.StringEscapeUtils;

import com.hp.hpl.jena.rdf.model.Model;

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
						
						String[] sub = string.split("\\|\\|");
						for (String subThing : sub) {
							subThing = subThing.trim();
							if (Strings.isNotBlank(subThing)) {
								output.getExamples().add(subThing);
							}
							
						}
					}
				}
			}
			output.setGlossary(str);
		}
		return output;
	}
}
