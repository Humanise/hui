package dk.in2isoft.onlineobjects.modules.language;

import org.hibernate.SQLQuery;

import dk.in2isoft.onlineobjects.core.CustomQuery;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.ui.data.CloudItem;

public class WordCloudQuery implements CustomQuery<CloudItem<Word>> {
	
	private long privileged;
	private Class<? extends Entity> type;
	private Long viewId;
	
	public WordCloudQuery(Privileged privileged, Class<? extends Entity> type) {
		super();
		this.privileged = privileged.getIdentity();
		this.type = type;
	}
	
	public WordCloudQuery withViewId(Long viewId) {
		this.viewId = viewId;
		return this;
	}

	public String getSQL() {
		StringBuilder sql = new StringBuilder();
		String cls = type.getSimpleName().toLowerCase();
		sql.append("select word.id as word_id,word.text,count(").append(cls).append(".id) as count from word,relation,").append(cls).append(",privilege");
		if (viewId!=null) {
			sql.append(",privilege as viewPrivilege");
		}
		sql.append(" where "+cls+".id = relation.super_entity_id and relation.sub_entity_id=word.id and privilege.object = "+cls+".id and privilege.alter=true and privilege.subject=:privileged");
		if (viewId!=null) {
			sql.append(" and viewPrivilege.object = "+cls+".id and viewPrivilege.view=true and viewPrivilege.subject=:viewId");
		}
		//sql.append(" group by word.id,word.text order by count desc limit 50");
		sql.append(" group by word.id,word.text order by lower(word.text)");
		return sql.toString();
	}

	public String getCountSQL() {
		return null;
	}

	public CloudItem<Word> convert(Object[] row) {
		CloudItem<Word> item = new CloudItem<Word>();
		Word dummy = new Word();
		dummy.setText((String) (row[1]==null ? "none" : row[1]));
		dummy.setId(((Number) row[0]).longValue());
		item.setCount(((Number) row[2]).intValue());
		item.setObject(dummy);
		return item;
	}

	public void setParameters(SQLQuery sql) {
		sql.setLong("privileged", privileged);
		if (viewId!=null) {
			sql.setLong("viewId", viewId);
		}
	}
}
