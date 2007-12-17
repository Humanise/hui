package dk.in2isoft.onlineobjects.model;



public class Entity extends Item {

	public static String NAMESPACE = Item.NAMESPACE+"Entity/";
	public static String TYPE = Item.TYPE+"/Entity";
	
	protected String name;

	public Entity() {
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	@Override
	public String getNamespace() {
		return NAMESPACE;
	}

	@Override
	public String getIcon() {
		return "Element/Generic";
	}

	public String getType() {
		return TYPE;
	}
}
