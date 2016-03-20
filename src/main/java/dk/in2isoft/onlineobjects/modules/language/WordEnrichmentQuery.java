package dk.in2isoft.onlineobjects.modules.language;

import org.hibernate.SQLQuery;

import dk.in2isoft.onlineobjects.apps.words.perspectives.WordEnrichmentPerspective;
import dk.in2isoft.onlineobjects.core.CustomQuery;

public class WordEnrichmentQuery implements CustomQuery<WordEnrichmentPerspective> {

	private static String SQL = "select entity.id,word.text from entity "+
			"inner join word on word.id=entity.id "+
			"inner join property "+
			"on entity.id=property.entity_id "+
			"and property.key='word.suggestion.language' "+
			"and property.value='da' "+
			"where entity.id not in (select "+
				"relation.sub_entity_id from property,pile,relation "+
				"where property.key='key' and property.value='words.postponed' "+
				"and pile.id=property.entity_id and relation.super_entity_id=pile.id"+
			") "+
			"order by word.text asc limit 1";
	
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
