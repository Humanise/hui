package dk.in2isoft.onlineobjects.model;

import dk.in2isoft.commons.lang.Strings;

public class Relation extends Item {

	public static final String TYPE = Item.TYPE+"/Relation";
	public static final String NAMESPACE = Item.NAMESPACE+"Relation/";

	public static final String KIND_COMMON_ORIGINATOR = "common.originator";
	public static final String KIND_COMMON_AUTHOR = "common.author";
	public static final String KIND_COMMON_SOURCE = "common.source";
	
	public static final String KIND_STRUCTURE_CONTAINS = "structure.contains";
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
	public static final String KIND_SYSTEM_USER_FAVORITES = "system.user.favorites";
	public static final String KIND_SYSTEM_USER_INBOX = "personal.inbox"; // TODO Rename to system.user.inbox
	
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

	
	private Entity from;

	private Entity to;

	private String kind;
	
	private float position;

	public Relation() {
	}

	public Relation(Entity from, Entity to) {
		this.from = from;
		this.to = to;
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

	public Entity getTo() {
		return to;
	}

	public void setTo(Entity to) {
		this.to = to;
	}

	public Entity getFrom() {
		return from;
	}

	public void setFrom(Entity from) {
		this.from = from;
	}

	@Override
	public String toString() {
		return super.toString()+" : "+this.from.toString()+" --> "+this.to.toString()+" ["+this.kind+"]";
	}

	public boolean matches(Class<? extends Entity> fromClass, String kind, Class<? extends Entity> toClass) {
		boolean matches = true;
		if (kind!=null) {
			matches &= Strings.equals(kind, this.kind);
		}
		matches &= from.getClass().isAssignableFrom(fromClass);
		matches &= to.getClass().isAssignableFrom(toClass);
		return matches;
	}

	
}
