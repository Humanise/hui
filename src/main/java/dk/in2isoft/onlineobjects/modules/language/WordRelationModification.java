package dk.in2isoft.onlineobjects.modules.language;

public class WordRelationModification {
	private String fromSourceId;
	private String toSourceId;
	private String relationKind;

	public String getFromSourceId() {
		return fromSourceId;
	}

	public void setFromSourceId(String fromSourceId) {
		this.fromSourceId = fromSourceId;
	}

	public String getToSourceId() {
		return toSourceId;
	}

	public void setToSourceId(String toSourceId) {
		this.toSourceId = toSourceId;
	}

	public String getRelationKind() {
		return relationKind;
	}

	public void setRelationKind(String relationKind) {
		this.relationKind = relationKind;
	}
	
	public static WordRelationModification create(String from, String kind, String to) {
		WordRelationModification mod = new WordRelationModification();
		mod.setFromSourceId(from);
		mod.setRelationKind(kind);
		mod.setToSourceId(to);
		return mod;
	}
}
