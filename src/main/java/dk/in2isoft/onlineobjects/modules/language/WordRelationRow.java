package dk.in2isoft.onlineobjects.modules.language;

public class WordRelationRow {

	private long relationId;
	private String relationKind;

	private long fromId;
	private String fromText;

	private long toId;
	private String toText;

	public long getRelationId() {
		return relationId;
	}

	public void setRelationId(long relationId) {
		this.relationId = relationId;
	}

	public String getRelationKind() {
		return relationKind;
	}

	public void setRelationKind(String relationKind) {
		this.relationKind = relationKind;
	}

	public long getFromId() {
		return fromId;
	}

	public void setFromId(long superId) {
		this.fromId = superId;
	}

	public String getFromText() {
		return fromText;
	}

	public void setFromText(String superText) {
		this.fromText = superText;
	}

	public long getToId() {
		return toId;
	}

	public void setToId(long subId) {
		this.toId = subId;
	}

	public String getToText() {
		return toText;
	}

	public void setToText(String subText) {
		this.toText = subText;
	}

}
