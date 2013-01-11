package dk.in2isoft.onlineobjects.apps.words.views;

import java.math.BigInteger;
import java.util.Collection;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.CustomQuery;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import edu.emory.mathcs.backport.java.util.Arrays;

public class WordListPerspectiveQuery implements CustomQuery<WordListPerspective> {

	public enum Ordering {
		created ("item.created desc"), updated ("item.updated desc"), text("lower(word.text) asc");
		
		private String x;
		
		Ordering(String x) {
			this.x = x;
		}
	
		public String toString() {
			return x;
		}
	};
	
	private Ordering ordering = Ordering.created;

	private int pageNumber;

	private int pageSize;
	
	private String startingWith;
	
	private List<String> words;
	
	private Collection<Long> ids;
	
	private static final String SQL = 
	" from word"+
	" left JOIN item on item.id=word.id "+
	
	" left outer JOIN relation as word_language on (word_language.sub_entity_id=word.id and word_language.super_entity_id in (select id from language))"+
	" left outer JOIN language on (word_language.super_entity_id=language.id)"+
	
	" left JOIN relation as word_category on (word_category.sub_entity_id=word.id and word_category.super_entity_id in (select id from lexicalcategory))"+
	" left JOIN lexicalcategory on word_category.super_entity_id=lexicalcategory.id"+
	" left JOIN property on word.id=property.enity_id and property.key='semantics.glossary'";

	public WordListPerspective convert(Object[] row) {
		WordListPerspective impression = new WordListPerspective();
		impression.setId(((BigInteger) row[0]).longValue());
		impression.setText((String) row[1]);
		impression.setUrlPart(Strings.encodeURL(StringUtils.lowerCase((String) row[1])));
		impression.setLanguage((String) row[2]);
		impression.setLexicalCategory((String) row[3]);
		impression.setGlossary((String) row[5]);
		return impression;
	}
	
	public String getCountSQL() {
		StringBuilder sql = new StringBuilder();
		sql.append("select count(word.id) as num  from word");
		sql.append(buildWhere());
		return sql.toString();
	}
	
	private String buildWhere() {
		StringBuilder sql = new StringBuilder();
		if (startingWith!=null) {
			sql.append(sql.length()>0 ? " and " : " where ");
			sql.append(" lower(word.text) like :startingWith"); 
		}
		if (words!=null) {
			sql.append(sql.length()>0 ? " and " : " where ");
			sql.append(" lower(word.text) in (:words)");
		}
		if (ids!=null && !ids.isEmpty()) {
			sql.append(sql.length()>0 ? " and " : " where ");
			sql.append(" word.id in (:ids)");
		}
		return sql.toString();
	}

	public String getSQL() {
		StringBuilder sql = new StringBuilder();
		sql.append("select word.id, word.text, language.code as language, lexicalcategory.code as category,item.created,property.value as glossary ");
		sql.append(SQL);
		sql.append(buildWhere());
		sql.append(" order by "+this.ordering+" ");
		if (pageSize>0) {
			sql.append(" limit ").append(pageSize);
			if (pageNumber>0) {
				sql.append(" offset ").append(pageSize*pageNumber);
			}
		}
		return sql.toString();
	}
	
	public void setParameters(SQLQuery sql) {
		if (startingWith!=null) {
			sql.setString("startingWith", startingWith+"%");
		}
		if (words!=null) {
			sql.setParameterList("words", words, new StringType());
		}
		if (ids!=null && !ids.isEmpty()) {
			sql.setParameterList("ids", ids, new LongType());
		}
	}
	
	public WordListPerspectiveQuery orderByUpdated() {
		this.ordering = Ordering.updated;
		return this;
	}
	
	public WordListPerspectiveQuery orderByText() {
		this.ordering = Ordering.text;
		return this;
	}
	
	public WordListPerspectiveQuery startingWith(String str) {
		this.startingWith = str;
		return this;
	}
	
	public WordListPerspectiveQuery withWords(List<String> str) {
		this.words = str;
		return this;
	}

	public WordListPerspectiveQuery withWords(String[] words) {
		this.words = Strings.asList(words);
		return this;
	}

	public WordListPerspectiveQuery withPaging(int pageNumber, int pageSize) {
		this.pageNumber = pageNumber;
		this.pageSize = pageSize;
		return this;
	}

	public WordListPerspectiveQuery withIds(Collection<Long> ids) {
		this.ids = ids;
		return this;
	}

}
