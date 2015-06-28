package dk.in2isoft.onlineobjects.util;

import java.util.Locale;

import org.springframework.context.NoSuchMessageException;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;

public class Messages extends ReloadableResourceBundleMessageSource {

	
	public Messages(Object obj) {
		this(obj.getClass());
	}
	
	public Messages(Class<?> clz) {
		StringBuilder basename = new StringBuilder();
		String[] parts = clz.getName().split("\\.");
		for (int i = 0; i < parts.length; i++) {
			if (i<parts.length-1) {
				basename.append(parts[i]).append("/");
			} else {
				basename.append("msg/").append(parts[i]);
			}
		}
		setBasename(basename.toString());
	}
	
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

	public String get(String property, String key, Locale locale) {
		try {
			return getMessage(property+"."+key, null, locale);
		} catch (NoSuchMessageException e) {
			return "???"+key+"???";
		}
	}
}
