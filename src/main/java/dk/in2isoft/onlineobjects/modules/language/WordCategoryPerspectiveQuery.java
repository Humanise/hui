package dk.in2isoft.onlineobjects.modules.language;

import java.math.BigInteger;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.SQLQuery;
import org.hibernate.type.StringType;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.onlineobjects.core.CustomQuery;

public class WordCategoryPerspectiveQuery implements CustomQuery<WordListPerspective> {
	
	private Set<String> words = new HashSet<>();
	private Set<String> categories = new HashSet<>();
	
	private static final String JOINS = 
			" left JOIN relation as word_category on (word_category.sub_entity_id=word.id and word_category.super_entity_id in (select id from lexicalcategory))" +
			" left JOIN lexicalcategory on word_category.super_entity_id=lexicalcategory.id";

	public WordListPerspective convert(Object[] row) {
		WordListPerspective impression = new WordListPerspective();
		impression.setId(((BigInteger) row[0]).longValue());
		impression.setText((String) row[1]);
		impression.setLexicalCategory((String) row[2]);
		return impression;
	}
	
	public String getCountSQL() {
		StringBuilder sql = new StringBuilder();
		sql.append("select count(word.id) as num from word");
		sql.append(JOINS);
		sql.append(buildWhere());
		return sql.toString();
	}
	
	private String buildWhere() {
		StringBuilder sql = new StringBuilder();
		if (Code.isNotEmpty(words)) {
			sql.append(sql.length()>0 ? " and " : " where ");
			sql.append(" lower(word.text) in (:words)");
		}
		if (Code.isNotEmpty(categories)) {
			sql.append(sql.length()>0 ? " and " : " where ");
			sql.append(" lexicalcategory.code in (:categories)");
		}
		return sql.toString();
	}

	public String getSQL() {
		StringBuilder sql = new StringBuilder();
		sql.append("select word.id, word.text, lexicalcategory.code from word");
		sql.append(JOINS);
		sql.append(buildWhere());
		return sql.toString();
	}
	
	public void setParameters(SQLQuery sql) {
		if (Code.isNotEmpty(words)) {
			sql.setParameterList("words", words, new StringType());
		}
		if (Code.isNotEmpty(categories)) {
			sql.setParameterList("categories", categories, new StringType());
		}
	}
	
	public WordCategoryPerspectiveQuery withWords(Collection<String> str) {
		for (String string : str) {
			words.add(string.toLowerCase());
		}
		return this;
	}

	public WordCategoryPerspectiveQuery withWords(String[] words) {
		for (String word : words) {
			this.words.add(word.toLowerCase());
		}
		return this;
	}


	public WordCategoryPerspectiveQuery withWord(String word) {
		if (word!=null) {
			this.words.add(word.toLowerCase());
		}
		return this;
	}

	public void withCategories(String... categories) {
		for (String string : categories) {
			this.categories.add(string);
		}
	}

}
