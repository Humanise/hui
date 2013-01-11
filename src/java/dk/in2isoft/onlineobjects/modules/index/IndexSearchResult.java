package dk.in2isoft.onlineobjects.modules.index;

import org.apache.lucene.document.Document;

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

}
