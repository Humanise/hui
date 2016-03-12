package dk.in2isoft.onlineobjects.modules.language;

import org.hibernate.SQLQuery;

import dk.in2isoft.onlineobjects.core.CustomQuery;

public class WordFacetsQuery implements CustomQuery<WordStatistic> {

	public String getSQL() {
		return "select count(word.id) as count,language.code as language, lexicalcategory.code as category"+
" from word left JOIN item on item.id=word.id"+
" left JOIN relation as word_language on (word_language.sub_entity_id=word.id and word_language.super_entity_id in (select id from language))"+
" left JOIN language on (word_language.super_entity_id=language.id)"+
" left JOIN relation as word_category on (word_category.sub_entity_id=word.id and word_category.super_entity_id in (select id from lexicalcategory))"+
" left JOIN lexicalcategory on word_category.super_entity_id=lexicalcategory.id  group by language, category order by count desc";
/*
		
		return "SELECT  "+
				"  count(word.id) as count, "+
				"  language.code as language, "+
				"  lexicalcategory.code as lexicalcategory "+
				"FROM  "+
				"  language,  "+
				"  lexicalcategory,  "+
				"  relation word_language,  "+
				"  relation word_category,  "+
				"  word "+
				"WHERE  "+
				"  language.id = word_language.super_entity_id AND "+
				"  lexicalcategory.id = word_category.super_entity_id AND "+
				"  word_language.sub_entity_id = word.id AND "+
				"  word_category.sub_entity_id = word.id "+
				"group by language.code, lexicalcategory.code ";*/
	}

	public String getCountSQL() {
		return null;
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
