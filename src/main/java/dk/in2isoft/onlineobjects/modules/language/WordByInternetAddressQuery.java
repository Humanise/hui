package dk.in2isoft.onlineobjects.modules.language;

import org.hibernate.SQLQuery;

import dk.in2isoft.in2igui.data.ItemData;
import dk.in2isoft.onlineobjects.core.CustomQuery;
import dk.in2isoft.onlineobjects.core.Privileged;

public class WordByInternetAddressQuery implements CustomQuery<ItemData> {

	private static String SQL = "select word.id as word_id,word.text,count(internetaddress.id) as count from word,relation,internetaddress,privilege "+
			" where privilege.subject=:privileged and privilege.alter=true and internetaddress.id = relation.super_entity_id and relation.sub_entity_id=word.id and privilege.object = internetaddress.id"+ 
			" group by word.id,word.text order by lower(word.text)";
	
	private long privileged;
	
	public WordByInternetAddressQuery(Privileged privileged) {
		super();
		this.privileged = privileged.getIdentity();
	}

	public String getSQL() {
		return SQL;
	}

	public String getCountSQL() {
		return null;
	}

	public ItemData convert(Object[] row) {
		ItemData item = new ItemData();
		item.setId(((Number) row[0]).longValue());
		item.setValue(((Number) row[0]));
		
		item.setTitle((String) (row[1]==null ? "none" : row[1]));
		item.setBadge(((Number) row[2]).toString());
		return item;
	}

	public void setParameters(SQLQuery sql) {
		sql.setLong("privileged", privileged);
	}
}
