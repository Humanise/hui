package dk.in2isoft.onlineobjects.apps.desktop.perspectives;

import dk.in2isoft.onlineobjects.model.Entity;

public class WidgetPerspective {

	private Entity entity;
	private String type;
	
	public WidgetPerspective(Entity entity) {
		this.entity = entity;
		this.type = entity.getClass().getSimpleName();
	}

	public Entity getEntity() {
		return entity;
	}

	public void setEntity(Entity entity) {
		this.entity = entity;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
}
