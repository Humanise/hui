package dk.in2isoft.commons.http;

import java.net.URI;
import java.net.URISyntaxException;

import dk.in2isoft.commons.lang.Files;

public class URLUtil {

	public static boolean isValidHttpUrl(String address) {
		try {
			URI url = new URI(address);
			return "http".equals(url.getScheme());
		} catch (URISyntaxException e) {
			return false;
		}
	}
	
	public static String toFileName(String url) {
		
		int li = url.lastIndexOf("/");
		if (li!=-1) {
			return Files.cleanFileName(url.substring(li+1));
		}
		return url;
	}
}
