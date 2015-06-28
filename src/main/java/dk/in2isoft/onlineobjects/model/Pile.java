package dk.in2isoft.onlineobjects.model;

import dk.in2isoft.in2igui.Icons;
import dk.in2isoft.onlineobjects.model.annotations.Appearance;

@Appearance(icon=Icons.COMMON_FOLDER)
public class Pile extends Entity {

	public static String TYPE = Entity.TYPE+"/Pile";
	
	public static String PROPERTY_KEY = "key";
	
	public Pile() {
		super();
	}

	public String getType() {
		return TYPE;
	}
}
