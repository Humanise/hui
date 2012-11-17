package dk.in2isoft.onlineobjects.apps.words.views;

import java.math.BigInteger;

import dk.in2isoft.onlineobjects.core.CustomQuery;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;

public class WordListPerspectiveQuery implements CustomQuery<WordListPerspective> {

	public enum Ordering {
		created ("item.created"), updated ("item.updated"), text("lower(word.text)");
		
		private String x;
		
		Ordering(String x) {
			this.x = x;
		}
	
		public String toString() {
			return x;
		}
	};
	
	private Ordering ordering = Ordering.created;
	
	private static final String SQL = 
	" from word"+
	" left JOIN item on item.id=word.id "+
	
	" left outer JOIN relation as word_language on (word_language.sub_entity_id=word.id and word_language.super_entity_id in (select id from language))"+
	" left outer JOIN language on (word_language.super_entity_id=language.id)"+
	
	" left JOIN relation as word_category on (word_category.sub_entity_id=word.id and word_category.super_entity_id in (select id from lexicalcategory))"+
	" left JOIN lexicalcategory on word_category.super_entity_id=lexicalcategory.id";

	public WordListPerspective convert(Object[] row) {
		WordListPerspective impression = new WordListPerspective();
		impression.setId(((BigInteger) row[0]).longValue());
		impression.setText((String) row[1]);
		impression.setLanguage((String) row[2]);
		impression.setLexicalCategory((String) row[3]);
		return impression;
	}
	
	public String getCountSQL() {
		return "select count(word.id) as num  from word";
	}

	public String getSQL() {
		return "select word.id, word.text, language.code as language, lexicalcategory.code as category,item.created "+SQL+" order by "+this.ordering+" desc limit 20";
	}
	
	public WordListPerspectiveQuery orderByUpdated() {
		this.ordering = Ordering.updated;
		return this;
	}

}
