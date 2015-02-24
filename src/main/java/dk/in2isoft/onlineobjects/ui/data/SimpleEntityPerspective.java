package dk.in2isoft.onlineobjects.ui.data;

import dk.in2isoft.onlineobjects.model.Entity;

public class SimpleEntityPerspective {
	private long id;
	private String name;
	private String type;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
	public static SimpleEntityPerspective create(Entity entity) {
		if (entity==null) {
			return null;
		}
		SimpleEntityPerspective perspective = new SimpleEntityPerspective();
		perspective.setId(entity.getId());
		perspective.setName(entity.getName());
		perspective.setType(entity.getType());
		return perspective;
	}
}
