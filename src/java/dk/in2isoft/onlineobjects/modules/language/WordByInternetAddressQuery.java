package dk.in2isoft.onlineobjects.modules.language;

import org.hibernate.SQLQuery;

import dk.in2isoft.onlineobjects.apps.words.perspectives.WordEnrichmentPerspective;
import dk.in2isoft.onlineobjects.core.CustomQuery;

public class WordByInternetAddressQuery implements CustomQuery<WordEnrichmentPerspective> {

	private static String SQL = "select word.id as word_id,word.text,count(internetaddress.id) as count from word,relation,internetaddress,privilege "+
			" where internetaddress.id = relation.super_entity_id and relation.sub_entity_id=word.id and privilege.object = internetaddress.id and privilege.subject=:privileged"+ 
			" group by word.id,word.text order by word.id";
	
	public String getSQL() {
		return SQL;
	}

	public String getCountSQL() {
		return null;
	}

	public WordEnrichmentPerspective convert(Object[] row) {
		WordEnrichmentPerspective stat = new WordEnrichmentPerspective();
		stat.setWordId(((Number) row[0]).longValue());
		stat.setText((String) (row[1]==null ? "none" : row[1]));
		return stat;
	}

	public void setParameters(SQLQuery sql) {
		
	}
}
