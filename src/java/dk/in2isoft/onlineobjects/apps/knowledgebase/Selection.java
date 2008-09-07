package dk.in2isoft.onlineobjects.apps.knowledgebase;

import java.util.List;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Topic;
import dk.in2isoft.onlineobjects.ui.Interface;
import dk.in2isoft.onlineobjects.ui.Request;

public class Selection extends Interface {

	public Selection() {
		super(new String[]{"Hierarchy","Script"});
	}

	@Override
	public void buildBody(Request request, StringBuilder gui) 
	throws EndUserException {
		gui.append("<interface>"+
		"<hierarchy xmlns='uri:Hierarchy'>");
		buildHierarchy(gui);
		gui.append(
		"</hierarchy>"+
		"<refresh xmlns='uri:Script' source='shouldUpdateSelection' interval='2000'/>"+
        "</interface>");
	}

	private void buildHierarchy(StringBuilder gui) {
		List<Topic> topics = Core.getInstance().getModel().search(Query.ofType(Topic.class));
		for (Entity entity : topics) {
			gui.append("<element title='");
			gui.append(escape(entity.getName()));
			gui.append("' icon='Element/Folder' target='Right' link='editTopic?id=");
			gui.append(entity.getId());
			gui.append("'/>");
		}
	}
	
}
