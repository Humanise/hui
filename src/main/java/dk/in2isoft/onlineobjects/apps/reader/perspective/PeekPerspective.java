package dk.in2isoft.onlineobjects.apps.reader.perspective;

import java.util.List;

import com.google.common.collect.Lists;

public class PeekPerspective {

	private String rendering;
	private long id;
	private String type;
	private List<Action> actions;
	private Object data;

	public static class Action {
		String text;
		String key;
		Object data;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getRendering() {
		return rendering;
	}

	public void setRendering(String rendering) {
		this.rendering = rendering;
	}
	
	public void addAction(String text, String key) {
		Action action = new Action();
		action.text = text;
		action.key = key;
		if (actions == null) {
			actions = Lists.newArrayList();
		}
		actions.add(action);
	}

	public List<Action> getActions() {
		return actions;
	}

	public void setActions(List<Action> actions) {
		this.actions = actions;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}
}
