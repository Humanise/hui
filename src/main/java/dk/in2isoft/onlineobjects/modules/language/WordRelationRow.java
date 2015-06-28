package dk.in2isoft.onlineobjects.modules.language;

public class WordRelationRow {

	private long relationId;
	private String relationKind;

	private long superId;
	private String superText;

	private long subId;
	private String subText;

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

	public long getSuperId() {
		return superId;
	}

	public void setSuperId(long superId) {
		this.superId = superId;
	}

	public String getSuperText() {
		return superText;
	}

	public void setSuperText(String superText) {
		this.superText = superText;
	}

	public long getSubId() {
		return subId;
	}

	public void setSubId(long subId) {
		this.subId = subId;
	}

	public String getSubText() {
		return subText;
	}

	public void setSubText(String subText) {
		this.subText = subText;
	}

}
