package dk.in2isoft.onlineobjects.modules.index;

import org.apache.commons.lang.StringUtils;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.IndexableField;

public class IndexSearchResult {

	private float score;
	private Document document;

	public IndexSearchResult(Document document, float score) {
		super();
		this.document = document;
		this.score = score;
	}

	public float getScore() {
		return score;
	}

	public void setScore(float score) {
		this.score = score;
	}

	public Document getDocument() {
		return document;
	}

	public void setDocument(Document document) {
		this.document = document;
	}

	public Long getLong(String string) {
		IndexableField field = document.getField(string);
		if (field!=null) {
			String value = field.stringValue();
			if (StringUtils.isNumeric(value)) {
				return Long.parseLong(value);
			}
		}
		return null;
	}

	public String getString(String string) {
		IndexableField field = document.getField(string);
		if (field!=null) {
			return field.stringValue();
		}
		return null;
	}

}
