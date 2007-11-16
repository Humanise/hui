package dk.in2isoft.onlineobjects.apps.knowledgebase;

import java.util.Date;

import dk.in2isoft.onlineobjects.apps.ApplicationSession;
import dk.in2isoft.onlineobjects.model.Topic;

public class KnowledgebaseSession extends ApplicationSession {

	private Topic editedTopic;
	private Date latestSelectionUpdate;
	
	public KnowledgebaseSession() {
		super();
		latestSelectionUpdate = new Date();
	}

	public Topic getEditedTopic() {
		return editedTopic;
	}

	public void setEditedTopic(Topic editedTopic) {
		this.editedTopic = editedTopic;
	}

	public void clearEditedTopic() {
		this.editedTopic = null;
	}

	public Date getLatestSelectionUpdate() {
		return latestSelectionUpdate;
	}

	public void setLatestSelectionUpdate(Date latestSelectionUpdate) {
		this.latestSelectionUpdate = latestSelectionUpdate;
	}
}
