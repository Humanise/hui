package dk.in2isoft.onlineobjects.apps.words.views.util;

public class RelationOption {

	private String label;
	private String kind;
	private boolean reverse;

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getKind() {
		return kind;
	}

	public void setKind(String code) {
		this.kind = code;
	}

	public boolean isReverse() {
		return reverse;
	}

	public void setReverse(boolean reverse) {
		this.reverse = reverse;
	}
}
