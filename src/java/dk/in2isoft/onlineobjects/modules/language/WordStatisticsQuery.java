package dk.in2isoft.onlineobjects.modules.language;

import org.hibernate.SQLQuery;

import dk.in2isoft.onlineobjects.core.CustomQuery;

public class WordStatisticsQuery implements CustomQuery<WordStatistic> {

	private static String SQL = "select count(word.id), language.code as language, lexicalcategory.code as category"+
			" from word left JOIN item on item.id=word.id"+
			" left outer JOIN relation as word_language on (word_language.sub_entity_id=word.id and word_language.super_entity_id in (select id from language))"+
			" left outer JOIN language on (word_language.super_entity_id=language.id)"+
			" left JOIN relation as word_category on (word_category.sub_entity_id=word.id and word_category.super_entity_id in (select id from lexicalcategory))"+
			" left JOIN lexicalcategory on word_category.super_entity_id=lexicalcategory.id  group by language, category";

	private static String DISTINCT_SQL = "select count(distinct lower(word.text)), language.code as language, lexicalcategory.code as category"+
			" from word left JOIN item on item.id=word.id"+
			" left outer JOIN relation as word_language on (word_language.sub_entity_id=word.id and word_language.super_entity_id in (select id from language))"+
			" left outer JOIN language on (word_language.super_entity_id=language.id)"+
			" left JOIN relation as word_category on (word_category.sub_entity_id=word.id and word_category.super_entity_id in (select id from lexicalcategory))"+
			" left JOIN lexicalcategory on word_category.super_entity_id=lexicalcategory.id  group by language, category";
	
	private boolean distinct;

	public String getSQL() {
		return distinct ? DISTINCT_SQL : SQL;
	}

	public String getCountSQL() {
		return null;
	}
	
	public WordStatisticsQuery distinct() {
		distinct = true;
		return this;
	}

	public WordStatistic convert(Object[] row) {
		WordStatistic stat = new WordStatistic();
		stat.setCount(((Number) row[0]).intValue());
		stat.setLanguage((String) (row[1]==null ? "none" : row[1]));
		stat.setCategory((String) (row[2]==null ? "none" : row[2]));
		return stat;
	}

	public void setParameters(SQLQuery sql) {
		
	}
}
