package dk.in2isoft.onlineobjects.apps.reader.perspective;

import java.util.List;

import dk.in2isoft.onlineobjects.core.Pair;

public class ListItemPerspective {
	
	private long id;
	private long statementId;
	private long addressId;
	private long questionId;
	private long hypothesisId;
	private String title;
	private String url;
	private String address;
	private List<Pair<Long,String>> tags;
	private String html;
	private String type;

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public List<Pair<Long,String>> getTags() {
		return tags;
	}

	public void setTags(List<Pair<Long,String>> tags) {
		this.tags = tags;
	}

	public String getHtml() {
		return html;
	}

	public void setHtml(String html) {
		this.html = html;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public long getStatementId() {
		return statementId;
	}

	public void setStatementId(long statementId) {
		this.statementId = statementId;
	}

	public long getAddressId() {
		return addressId;
	}

	public void setAddressId(long addressId) {
		this.addressId = addressId;
	}

	public long getQuestionId() {
		return questionId;
	}

	public void setQuestionId(long questionId) {
		this.questionId = questionId;
	}

	public long getHypothesisId() {
		return hypothesisId;
	}

	public void setHypothesisId(long hypothesisId) {
		this.hypothesisId = hypothesisId;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
}
