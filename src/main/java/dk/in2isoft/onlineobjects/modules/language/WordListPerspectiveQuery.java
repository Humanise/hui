package dk.in2isoft.onlineobjects.modules.language;

import java.math.BigInteger;
import java.util.Collection;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.CustomQuery;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Relation;

public class WordListPerspectiveQuery implements CustomQuery<WordListPerspective> {

	public enum Ordering {
		created ("item.created desc"), 
		updated ("item.updated desc"),
		id ("word.id desc"),
		text("lower(word.text) asc");
		
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
	
	private boolean startingWithSymbol;
	
	private List<String> words;
	
	private Collection<Long> ids;
	
	private static final String SQL = 
	" from word"+
	" left JOIN item on item.id=word.id "+
	
	" left outer JOIN relation as word_language on (word_language.sub_entity_id=word.id and word_language.super_entity_id in (select id from language))"+
	" left outer JOIN language on (word_language.super_entity_id=language.id)"+
	
	" left JOIN relation as word_category on (word_category.sub_entity_id=word.id and word_category.super_entity_id in (select id from lexicalcategory))"+
	" left JOIN relation as word_source on (word_source.super_entity_id=word.id and word_source.kind='" + Relation.KIND_COMMON_SOURCE + "')"+
	" left JOIN lexicalcategory on word_category.super_entity_id=lexicalcategory.id"+
	" left JOIN property on word.id=property.entity_id and property.key='semantics.glossary'";

	public WordListPerspective convert(Object[] row) {
		WordListPerspective impression = new WordListPerspective();
		impression.setId(((BigInteger) row[0]).longValue());
		impression.setText((String) row[1]);
		impression.setUrlPart(Strings.encodeURL(StringUtils.lowerCase((String) row[1])));
		impression.setLanguage((String) row[2]);
		impression.setLexicalCategory((String) row[3]);
		impression.setGlossary((String) row[5]);
		Number sourceId = (Number) row[6];
		if (sourceId!=null) {
			impression.setSourceId(sourceId.longValue());
		}
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
		if (startingWithSymbol) {
			sql.append(sql.length()>0 ? " and " : " where ");
			sql.append(" lower(substring(word.text from 1 for 1)) not in (:alphabeth)"); 			
		}
		if (words!=null) {
			sql.append(sql.length()>0 ? " and " : " where ");
			if (words.size()>0) {
				sql.append(" lower(word.text) in (:words)");
			} else {
				sql.append(" word.id=-1");
			}
			
		}
		if (ids!=null && !ids.isEmpty()) {
			sql.append(sql.length()>0 ? " and " : " where ");
			sql.append(" word.id in (:ids)");
		}
		return sql.toString();
	}

	public String getSQL() {
		StringBuilder sql = new StringBuilder();
		sql.append("select word.id, word.text, language.code as language, lexicalcategory.code as category,item.created,property.value as glossary, word_source.sub_entity_id as source ");
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
		if (Code.isNotEmpty(words)) {
			sql.setParameterList("words", words, new StringType());
		}
		if (Code.isNotEmpty(ids)) {
			sql.setParameterList("ids", ids, new LongType());
		}
		if (startingWithSymbol) {
			sql.setParameterList("alphabeth", Strings.ALPHABETH, new StringType());
		}
	}
	
	public WordListPerspectiveQuery orderByUpdated() {
		this.ordering = Ordering.updated;
		return this;
	}
	
	public WordListPerspectiveQuery orderByCreated() {
		this.ordering = Ordering.created;
		return this;
	}
	
	public WordListPerspectiveQuery orderByText() {
		this.ordering = Ordering.text;
		return this;
	}
	
	public WordListPerspectiveQuery orderById() {
		this.ordering = Ordering.id;
		return this;
	}

	public WordListPerspectiveQuery startingWith(String str) {
		this.startingWith = str;
		return this;
	}

	public WordListPerspectiveQuery startingWithSymbol() {
		this.startingWithSymbol = true;
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


	public WordListPerspectiveQuery withWord(String word) {
		this.words = Lists.newArrayList(word);
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

	public WordListPerspectiveQuery withWord(Entity word) {
		if (this.ids==null) {
			this.ids = Lists.newArrayList();
		}
		this.ids.add(word.getId());
		return this;
	}

	public void withId(Long id) {
		if (this.ids==null) {
			this.ids = Lists.newArrayList();
		}
		this.ids.add(id);
	}

}
