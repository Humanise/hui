package dk.in2isoft.commons.http;

import java.net.URI;
import java.net.URISyntaxException;

public class URLUtil {

	public static boolean isValidHttpUrl(String address) {
		try {
			URI url = new URI(address);
			return "http".equals(url.getScheme());
		} catch (URISyntaxException e) {
			return false;
		}
	}
}
