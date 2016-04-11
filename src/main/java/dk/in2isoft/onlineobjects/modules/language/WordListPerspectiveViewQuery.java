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

public class WordListPerspectiveViewQuery implements CustomQuery<WordListPerspective> {

	public enum Ordering {
		created ("created desc"), 
		id ("id desc"),
		text("text_lower asc");
		
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
	
	private String language;
	
	private String category;

	private boolean startingWithSymbol;
	
	private List<String> words;
	
	private Collection<Long> ids;
	
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
		sql.append("select count(id) as num from word_list_view");
		sql.append(buildWhere());
		return sql.toString();
	}
	
	private String buildWhere() {
		StringBuilder sql = new StringBuilder();
		if (Strings.isNotBlank(startingWith)) {
			sql.append(sql.length()>0 ? " and " : " where ");
			sql.append(" letter=:startingWith"); 
		}
		if (startingWithSymbol) {
			sql.append(sql.length()>0 ? " and " : " where ");
			sql.append(" (letter='?' or letter='#')");
		}
		if (Strings.isNotBlank(language)) {
			sql.append(sql.length()>0 ? " and " : " where ");
			sql.append(" language=:language");
		}
		if (Strings.isNotBlank(category)) {
			sql.append(sql.length()>0 ? " and " : " where ");
			sql.append(" category=:category");
		}
		if (words!=null) {
			sql.append(sql.length()>0 ? " and " : " where ");
			if (words.size()>0) {
				sql.append(" text_lower in (:words)");
			} else {
				sql.append(" id=-1");
			}
			
		}
		if (ids!=null && !ids.isEmpty()) {
			sql.append(sql.length()>0 ? " and " : " where ");
			sql.append(" id in (:ids)");
		}
		return sql.toString();
	}

	public String getSQL() {
		StringBuilder sql = new StringBuilder();
		sql.append("select id, text, language, category, created, glossary, source from word_list_view");
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
		if (Strings.isNotBlank(startingWith)) {
			sql.setString("startingWith", startingWith);
		}
		if (Strings.isNotBlank(language)) {
			sql.setString("language", language);
		}
		if (Strings.isNotBlank(category)) {
			sql.setString("category", category);
		}
		if (Code.isNotEmpty(words)) {
			sql.setParameterList("words", words, new StringType());
		}
		if (Code.isNotEmpty(ids)) {
			sql.setParameterList("ids", ids, new LongType());
		}
	}
		
	public WordListPerspectiveViewQuery orderByCreated() {
		this.ordering = Ordering.created;
		return this;
	}
	
	public WordListPerspectiveViewQuery orderByText() {
		this.ordering = Ordering.text;
		return this;
	}
	
	public WordListPerspectiveViewQuery orderById() {
		this.ordering = Ordering.id;
		return this;
	}

	public WordListPerspectiveViewQuery startingWith(String str) {
		this.startingWith = str;
		return this;
	}

	public WordListPerspectiveViewQuery startingWithSymbol() {
		this.startingWithSymbol = true;
		return this;
	}
	
	public WordListPerspectiveViewQuery withWords(List<String> str) {
		this.words = str;
		return this;
	}

	public WordListPerspectiveViewQuery withWords(String[] words) {
		this.words = Strings.asList(words);
		return this;
	}

	public WordListPerspectiveViewQuery withLanguage(String language) {
		this.language = language;
		return this;
	}

	public WordListPerspectiveViewQuery withCategory(String category) {
		this.category = category;
		return this;
	}

	public WordListPerspectiveViewQuery withWord(String word) {
		this.words = Lists.newArrayList(word);
		return this;
	}

	public WordListPerspectiveViewQuery withPaging(int pageNumber, int pageSize) {
		this.pageNumber = pageNumber;
		this.pageSize = pageSize;
		return this;
	}

	public WordListPerspectiveViewQuery withIds(Collection<Long> ids) {
		this.ids = ids;
		return this;
	}

	public WordListPerspectiveViewQuery withWord(Entity word) {
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
