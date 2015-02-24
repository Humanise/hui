package dk.in2isoft.onlineobjects.modules.photos;

import org.hibernate.SQLQuery;

import dk.in2isoft.onlineobjects.core.CustomQuery;
import dk.in2isoft.onlineobjects.core.Privileged;

public class SimplePhotoQuery implements CustomQuery<SimplePhotoPerspective> {
	
	private long viewer;
	
	public SimplePhotoQuery(Privileged viewer) {
		super();
		this.viewer = viewer.getIdentity();
	}

	public String getSQL() {
		StringBuilder sql = new StringBuilder();
		sql.append("select image.id, image.width, image.height, entity.name, own.subject as owner from image ");
		sql.append("left join privilege as own ON own.object = image.id and own.subject!=:viewer and own.alter = true, privilege as view_privilege, entity "); 
		sql.append("where view_privilege.object = image.id and view_privilege.subject=:viewer and view_privilege.view = TRUE and entity.id = image.id order by entity.id desc");

		return sql.toString();
	}

	public String getCountSQL() {
		return null;
	}

	public SimplePhotoPerspective convert(Object[] row) {
		SimplePhotoPerspective item = new SimplePhotoPerspective();
		if (row[0]!=null) {
			item.setId(((Number) row[0]).longValue());
		}
		if (row[1]!=null) {
			item.setWidth(((Number) row[1]).intValue());
		}
		if (row[2]!=null) {
			item.setHeight(((Number) row[2]).intValue());
		}
		if (row[3]!=null) {
			item.setTitle(row[3].toString());
		}
		if (row[4]!=null) {
			item.setOwnerId(((Number) row[4]).longValue());
		}
		return item;
	}

	public void setParameters(SQLQuery sql) {
		sql.setLong("viewer", viewer);
	}
}
