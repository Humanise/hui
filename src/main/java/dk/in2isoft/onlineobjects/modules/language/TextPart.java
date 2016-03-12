package dk.in2isoft.onlineobjects.modules.language;

import java.io.Serializable;

public class TextPart implements Serializable {
	
	private static final long serialVersionUID = 3902017762321253134L;

	private String text;
	private String partOfSpeech;
	private boolean significant;

	public TextPart(String text, String pos) {
		this.text = text;
		this.partOfSpeech = pos;
	}
	
	public String getText() {
		return text;
	}
	
	public String getPartOfSpeech() {
		return partOfSpeech;
	}

	public boolean isSignificant() {
		return significant;
	}

	public void setSignificant(boolean significant) {
		this.significant = significant;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((partOfSpeech == null) ? 0 : partOfSpeech.hashCode());
		result = prime * result + (significant ? 1231 : 1237);
		result = prime * result + ((text == null) ? 0 : text.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		TextPart other = (TextPart) obj;
		if (partOfSpeech == null) {
			if (other.partOfSpeech != null)
				return false;
		} else if (!partOfSpeech.equals(other.partOfSpeech))
			return false;
		if (significant != other.significant)
			return false;
		if (text == null) {
			if (other.text != null)
				return false;
		} else if (!text.equals(other.text))
			return false;
		return true;
	}
	
}