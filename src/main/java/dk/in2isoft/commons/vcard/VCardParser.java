package dk.in2isoft.commons.vcard;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.ArrayUtils;
import org.apache.log4j.Logger;

public class VCardParser {

	private static Logger log = Logger.getLogger(VCardParser.class);
	
	private VCard latestCard;
	List<VCard> cards = new ArrayList<VCard>();
	
	public VCardParser() {
		super();
	}

	@SuppressWarnings("unchecked")
	public List<VCard> parse(File file) throws FileNotFoundException,IOException {
		List<String> lines = FileUtils.readLines(file, "UTF-16");
		StringBuilder fullLine = new StringBuilder();
		for (Iterator<String> iter = lines.iterator(); iter.hasNext();) {
			String line = iter.next();
			if (line.startsWith(" ")) {
				fullLine.append(line.trim());
			} else {
				parseLine(fullLine.toString());
				fullLine.delete(0, fullLine.length());
				fullLine.append(line);
			}
		}
		parseLine(fullLine.toString());
		log.debug("Cardnum="+cards.size());
		return cards;
	}
	
	private void parseLine(String line) {
		ParsedLine parsed = new ParsedLine(line);
		if (parsed.getName().equals("BEGIN")) {
			latestCard = new VCard();
		} else if (parsed.getName().equals("END")) {
			cards.add(latestCard);
		} else if (parsed.getName().equals("N")) {
			String[] data = parsed.getData();
			if (data.length>0) {
				latestCard.setFamilyName(data[0]);
			}
			if (data.length>1) {
				latestCard.setGivenName(data[1]);
			}
			if (data.length>2) {
				latestCard.setAdditionalName(data[2]);
			}
			if (data.length>3) {
				latestCard.setNamePrefix(data[3]);
			}
			if (data.length>4) {
				latestCard.setNameSuffix(data[4]);
			}
		} else if (parsed.getName().equals("TITLE")) {
			latestCard.setTitle(parsed.getData()[0]);
		} else if (parsed.getName().equals("EMAIL") && parsed.getData().length>0) {
			latestCard.getEmails().add(new VCardEmail(parsed.getData()[0]));
		} else if (parsed.getName().equals("TEL") && parsed.getData().length>0) {
			latestCard.getPhones().add(new VCardPhone(parsed.getData()[0]));
		}
	}
	
	private class ParsedLine {
		
		private String name = "";
		private String[] data = new String[] {};
		private Map<String, String> properties = new HashMap<String, String>();
		
		ParsedLine(String line) {
			int i = line.indexOf(":");
			if (i>-1) {
				String[] splitted = line.substring(0, i).split(";");
				for (int j = 1; j < splitted.length; j++) {
					String[] parts = splitted[j].split("=");
					if (parts.length>1) {
						properties.put(parts[0], parts[1]);
					} else {
						properties.put(parts[0], null);
					}
				}
				name = splitted[0];
				data = line.substring(i+1).split(";");
				log.debug(name);
				log.debug(ArrayUtils.toString(data, ","));
			}
		}
		
		String getName() {
			return name;
		}
		
		String[] getData() {
			return data;
		}
	}
}
