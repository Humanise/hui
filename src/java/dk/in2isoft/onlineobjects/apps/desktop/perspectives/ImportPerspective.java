package dk.in2isoft.onlineobjects.apps.desktop.perspectives;

import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.modules.importing.ImportSession;

public class ImportPerspective {

	private String id;
	private String status;
	private Entity entity;

	public ImportPerspective(ImportSession session) {
		this.id = session.getId();
		this.status = session.getStatus().name();
		this.entity = (Entity) session.getTransport().getResult();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Entity getEntity() {
		return entity;
	}

	public void setEntity(Entity entity) {
		this.entity = entity;
	}
}
