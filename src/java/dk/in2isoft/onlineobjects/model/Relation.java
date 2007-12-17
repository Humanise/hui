package dk.in2isoft.onlineobjects.model;

public class Relation extends Item {

	public static final String TYPE = Item.TYPE+"/Relation";
	public static final String NAMESPACE = Item.NAMESPACE+"Relation/";
	
	public static final String KIND_WEB_CONTENT = "web.content";
	public static final String KIND_WEB_PRIMARY = "web.primary";
	public static final String KIND_SYSTEM_USER_SELF = "system.user.self";
	public static final String KIND_INIVATION_INVITER = "invitation.inviter";
	public static final String KIND_INIVATION_INVITED = "invitation.invited";
	
	private Entity superEntity;

	private Entity subEntity;

	private String kind;
	
	private float position;

	public Relation() {
	}

	public Relation(Entity superEntity, Entity subEntity) {
		this.superEntity = superEntity;
		this.subEntity = subEntity;
	}

	public String getKind() {
		return kind;
	}

	public void setKind(String kind) {
		this.kind = kind;
	}

	public float getPosition() {
		return position;
	}

	public void setPosition(float order) {
		this.position = order;
	}

	public Entity getSubEntity() {
		return subEntity;
	}

	public void setSubEntity(Entity subEntity) {
		this.subEntity = subEntity;
	}

	public Entity getSuperEntity() {
		return superEntity;
	}

	public void setSuperEntity(Entity superEntity) {
		this.superEntity = superEntity;
	}

}
