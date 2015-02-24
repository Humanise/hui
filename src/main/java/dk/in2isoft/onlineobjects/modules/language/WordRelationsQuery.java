package dk.in2isoft.onlineobjects.modules.language;

import org.hibernate.SQLQuery;

import dk.in2isoft.onlineobjects.core.CustomQuery;
import dk.in2isoft.onlineobjects.model.Word;

public class WordRelationsQuery implements CustomQuery<WordRelationRow> {

	private static String SQL = "select relation.id as relation_id, relation.kind as relation_kind, "+
			"super_word.id as super_word_id, super_word.text as super_word_text, "+
			"sub_word.id as sub_word_id, sub_word.text as sub_word_text "+
			"from relation, word as super_word, word as sub_word "+
			"where relation.super_entity_id = super_word.id and relation.sub_entity_id = sub_word.id "+
			"and (relation.super_entity_id=:wordId or relation.sub_entity_id=:wordId)";
	
	private long wordId;
	
	public WordRelationsQuery(Word word) {
		super();
		this.wordId = word.getId();
	}

	public String getSQL() {
		return SQL;
	}

	public String getCountSQL() {
		return null;
	}

	public WordRelationRow convert(Object[] row) {
		WordRelationRow item = new WordRelationRow();
		item.setRelationId(((Number) row[0]).longValue());
		item.setRelationKind((String) row[1]);

		item.setSuperId(((Number) row[2]).longValue());
		item.setSuperText((String) row[3]);

		item.setSubId(((Number) row[4]).longValue());
		item.setSubText((String) row[5]);

		return item;
	}

	public void setParameters(SQLQuery sql) {
		sql.setLong("wordId", wordId);
	}
}
