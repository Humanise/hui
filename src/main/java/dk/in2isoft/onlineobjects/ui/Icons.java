package dk.in2isoft.onlineobjects.ui;

import java.util.HashMap;
import java.util.Map;

public class Icons {
	public static final Map<String,Character> font = new HashMap<String, Character>();
	
	static {
		font.put("phone", 'p');
		font.put("user", 'u');
		font.put("globe", 'g');
		font.put("envelope", 'e');
		font.put("camera", 'c');
		font.put("book", 'b');
		font.put("delete", '*');
		font.put("album", 'l');
		font.put("edit", '=');
		font.put("add", '+');
		font.put("present", '!');
		font.put("photos", '^');
	}
}
