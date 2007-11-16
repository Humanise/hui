package dk.in2isoft.onlineobjects.apps.knowledgebase;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.model.Topic;
import dk.in2isoft.onlineobjects.ui.SimpleWindow;

public class TopicEditor extends SimpleWindow {

	private Topic topic;
	
	public TopicEditor(Topic topic) {
		super(new String[]{"Window","Form"});
		this.topic = topic;
		if (topic.isNew()) {
			title = "New topic";
		} else {
			title = topic.getName();
		}
		icon = topic.getIcon();
		width="400";
		align = ALIGN_CENTER;
		background = true;
	}

	@Override
	protected void buildWindowContents(StringBuilder gui) throws EndUserException {
		gui.append(
	        "<form xmlns='uri:Form' action='saveTopic'>"+
	        "<group size='Large'>"+
	        "<textfield badge='Title:' name='name'>"+escape(topic.getName())+"</textfield>"+
	        "<buttongroup size='Large'>"+
	        "<button title='Cancel' link='right'/>"+
	        "<button title='"+(topic.isNew() ? "Create" : "Update")+"' submit='true' style='Hilited'/>"+
	        "</buttongroup>"+
	        "</group>"+
	        "</form>"
	    );
		
	}

}
