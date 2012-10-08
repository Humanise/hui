package dk.in2isoft.onlineobjects.util;

import java.util.Locale;

import org.springframework.context.NoSuchMessageException;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;;

public class Messages extends ReloadableResourceBundleMessageSource {

	public Messages(String basename) {
		setBasename(basename);
	}
	
	public String get(String key, Locale locale) {
		try {
			return getMessage(key, null, locale);
		} catch (NoSuchMessageException e) {
			return "???"+key+"???";
		}
	}
}
