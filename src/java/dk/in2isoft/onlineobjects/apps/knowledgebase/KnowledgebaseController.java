package dk.in2isoft.onlineobjects.apps.knowledgebase;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.apps.ApplicationSession;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.model.Item;
import dk.in2isoft.onlineobjects.model.Topic;
import dk.in2isoft.onlineobjects.ui.Interface;
import dk.in2isoft.onlineobjects.ui.Request;

public class KnowledgebaseController extends ApplicationController {

	private Date latestTopicChange;

	public KnowledgebaseController() {
		super("knowledgebase");
		latestTopicChange = new Date();
	}

	@Override
	public ApplicationSession createToolSession() {
		return new KnowledgebaseSession();
	}

	private KnowledgebaseSession getToolSession(Request request) {
		return (KnowledgebaseSession) request.getSession().getToolSession("knowledgebase");
	}

	@Override
	public void itemWasCreated(Item item) {
		latestTopicChange = new Date();
	}

	@Override
	public void itemWasUpdated(Item item) {
		latestTopicChange = new Date();
	}

	@Override
	public void unknownRequest(Request request) throws IOException, EndUserException {
		Interface gui = new Base();
		gui.display(request);
	}

	public void right(Request request) throws IOException, EndUserException {
		Interface gui = new Empty();
		gui.display(request);
	}

	public void left(Request request) throws IOException, EndUserException {
		Interface gui = new Left();
		gui.display(request);
	}

	public void selection(Request request) throws IOException, EndUserException {
		Interface gui = new Selection();
		gui.display(request);
		getToolSession(request).setLatestSelectionUpdate(new Date());
	}

	public void shouldUpdateSelection(Request request) throws IOException, EndUserException {
		PrintWriter p = request.getResponse().getWriter();
		if (latestTopicChange.getTime() > getToolSession(request).getLatestSelectionUpdate().getTime()) {
			p.print("true");
		} else {
			p.print("false");
		}
		p.close();
	}

	// ///////////////////////////// Topics ///////////////////////////

	public void newTopic(Request request) throws IOException, EndUserException {
		Topic topic = new Topic();
		getToolSession(request).setEditedTopic(topic);
		Interface gui = new TopicEditor(topic);
		gui.display(request);
	}

	public void editTopic(Request request) throws IOException, EndUserException {
		Topic topic = (Topic) getModel().get(Topic.class,request.getLong("id"));
		getToolSession(request).setEditedTopic(topic);
		Interface gui = new TopicEditor(topic);
		gui.display(request);
	}

	public void saveTopic(Request request) throws IOException, EndUserException {
		Topic topic = getToolSession(request).getEditedTopic();
		topic.setName(request.getString("name"));
		if (topic.isNew()) {
			getModel().createItem(topic,request.getSession());			
		} else {
			getModel().updateItem(topic,request.getSession());
		}
		getToolSession(request).clearEditedTopic();
		request.redirect("right");
	}

}
