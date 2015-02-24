package dk.in2isoft.onlineobjects.util;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class Dates {
	
	private static Map<String,String> LONG = new HashMap<String, String>();
	private static Map<String,String> SHORT = new HashMap<String, String>();
	private static Map<String,String> DATEWITHTIME = new HashMap<String, String>();
	
	static {
		LONG.put("en", "EEEE MMMM d. yyyy 'at' HH:mm:ss");
		LONG.put("da", "EEEE 'd.' d. MMMM yyyy 'kl.' HH:mm:ss");

		DATEWITHTIME.put("en", "MMMM d. yyyy 'at' HH:mm:ss");
		DATEWITHTIME.put("da", "d. MMMM yyyy 'kl.' HH:mm:ss");

		SHORT.put("en", "MMMM d. yyyy");
		SHORT.put("da", "d. MMMM yyyy");
	}

	public static String formatLongDate(Date date, Locale locale) {
		if (date==null) {
			return "";
		}
		SimpleDateFormat format = new SimpleDateFormat(LONG.get(locale.getLanguage()),locale);
		return format.format(date);
	}

	public static String formatShortDate(Date date, Locale locale) {
		if (date==null) {
			return "";
		}
		SimpleDateFormat format = new SimpleDateFormat(SHORT.get(locale.getLanguage()),locale);
		return format.format(date);
	}

	public static String formatDateWithTime(Date date, Locale locale) {
		if (date==null) {
			return "";
		}
		SimpleDateFormat format = new SimpleDateFormat(DATEWITHTIME.get(locale.getLanguage()),locale);
		return format.format(date);
	}

	public static String formatTime(Date date, Locale locale) {
		if (date==null) {
			return "";
		}
		SimpleDateFormat format = new SimpleDateFormat("HH:mm:ss",locale);
		return format.format(date);
	}

	public static String formatDate(Date value, boolean weekday, boolean time, Locale locale) {
		if (value==null) {
			return "";
		}
		if (!weekday && time) {
			return formatDateWithTime(value, locale);
		}
		if (weekday && time) {
			return formatLongDate(value, locale);
		}
		return formatShortDate(value, locale);
	}
}
