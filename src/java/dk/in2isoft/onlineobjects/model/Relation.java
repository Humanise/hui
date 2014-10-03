package dk.in2isoft.onlineobjects.model;

public class Relation extends Item {

	public static final String TYPE = Item.TYPE+"/Relation";
	public static final String NAMESPACE = Item.NAMESPACE+"Relation/";

	public static final String KIND_COMMON_ORIGINATOR = "common.originator";
	public static final String KIND_COMMON_AUTHOR = "common.author";
	public static final String KIND_COMMON_SOURCE = "common.source";

	public static final String KIND_STRUCTURE_SPECIALIZATION = "structure.specialization";
	
	public static final String KIND_SEMANTICS_ANALOGOUS = "semantics.analogous";
	public static final String KIND_SEMANTICS_EQUIVALENT = "semantics.equivalent";
	public static final String KIND_SEMANTICS_SYNONYMOUS = "semantics.synonymous";
	public static final String KIND_SEMANTICS_ANTONYMOUS = "semantics.antonymous";
	public static final String KIND_SEMANTICS_MORPHEME = "semantics.morpheme";
	public static final String KIND_SEMANTICS_GENRALTIZATION = "semantics.hypernym";

	public static final String KIND_WEB_CONTENT = "web.content";
	public static final String KIND_WEB_PRIMARY = "web.primary";
	public static final String KIND_SYSTEM_USER_SELF = "system.user.self";
	public static final String KIND_SYSTEM_USER_EMAIL = "system.user.email";
	public static final String KIND_SYSTEM_USER_IMAGE = "system.user.image";
	public static final String KIND_INIVATION_INVITER = "invitation.inviter";
	public static final String KIND_INIVATION_INVITED = "invitation.invited";
	
	public static final String KIND_SOCIAL_FRIEND = "social.friend";
	
	public static final String KIND_FAMILY_PARENT = "family.parent";
	public static final String KIND_FAMILY_PARENT_MOTHER = "family.parent.mother";
	public static final String KIND_FAMILY_PARENT_FATHER = "family.parent.father";
	public static final String KIND_FAMILY_SIBLING = "family.sibling";
	public static final String KIND_FAMILY_SIBLING_BROTHER = "family.sibling.brother";
	public static final String KIND_FAMILY_SIBLING_SISTER = "family.sibling.sister";

	public static final String KIND_EVENT_ATTENDEE = "event.attendee";
	public static final String KIND_EVENT_ORGANIZER = "event.organizer";
	
	public static final String KIND_STRUCTURE_CONTAINS = "structure.contains";
	
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

	@Override
	public String toString() {
		return super.toString()+" : "+this.superEntity.toString()+" --> "+this.subEntity.toString()+" ["+this.kind+"]";
	}

	
}
