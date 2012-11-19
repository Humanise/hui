package dk.in2isoft.onlineobjects.modules.language;

import java.util.List;

import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Word;

public class WordImpression {

	private Word word;
	private LexicalCategory lexicalCategory;
	private List<WordRelationGroup> relations;
	private String glossary;
	private List<String> examples;
	private String dataSource;
	private Language language;
	private User originator;

	public void setWord(Word word) {
		this.word = word;
	}

	public Word getWord() {
		return word;
	}

	public void setLexicalCategory(LexicalCategory lexicalCategory) {
		this.lexicalCategory = lexicalCategory;
	}

	public LexicalCategory getLexicalCategory() {
		return lexicalCategory;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public Language getLanguage() {
		return language;
	}

	public User getOriginator() {
		return originator;
	}

	public void setOriginator(User originator) {
		this.originator = originator;
	}

	public List<WordRelationGroup> getRelations() {
		return relations;
	}

	public void setRelations(List<WordRelationGroup> relations) {
		this.relations = relations;
	}

	public void setGlossary(String glossary) {
		this.glossary = glossary;
	}

	public String getGlossary() {
		return glossary;
	}

	public void setDataSource(String dataSource) {
		this.dataSource = dataSource;
	}

	public String getDataSource() {
		return dataSource;
	}

	public void setExamples(List<String> examples) {
		this.examples = examples;
	}

	public List<String> getExamples() {
		return examples;
	}

	public static class WordRelationGroup {
		private String kind;
		private List<WordRelation> relations;

		public String getKind() {
			return kind;
		}

		public void setKind(String kind) {
			this.kind = kind;
		}

		public List<WordRelation> getRelations() {
			return relations;
		}

		public void setRelations(List<WordRelation> relations) {
			this.relations = relations;
		}
	}

	public static class WordRelation {

		private Word word;
		private long id;

		public WordRelation() {
		}

		public Word getWord() {
			return word;
		}

		public void setWord(Word word) {
			this.word = word;
		}

		public long getId() {
			return id;
		}

		public void setId(long id) {
			this.id = id;
		}
	}

}
