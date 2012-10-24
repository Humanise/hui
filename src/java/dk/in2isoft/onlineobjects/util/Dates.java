package dk.in2isoft.onlineobjects.util;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class Dates {
	
	private static Map<String,String> formats = new HashMap<String, String>();
	
	static {
		formats.put("en", "EEEE MMMM d. yyyy 'at' HH:mm:ss");
		formats.put("da", "EEEE 'd.' d. MMMM yyyy 'kl.' HH:mm:ss");
	}

	public static String formatLongDate(Date date, Locale locale) {
		SimpleDateFormat format = new SimpleDateFormat(formats.get(locale.getLanguage()),locale);
		return format.format(date);
	}
}
