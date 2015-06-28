package dk.in2isoft.onlineobjects.modules.index;

import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.TextField;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.WordImpression;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.services.LanguageService;

public class WordIndexDocumentBuilder implements IndexDocumentBuilder<Word> {
	
	private LanguageService languageService;

	public Document build(Word word) throws ModelException {
		
		WordImpression impression = languageService.getImpression(word);
		StringBuilder text = new StringBuilder();
		text.append(word.getText()).append(" ");
		String glossary = word.getPropertyValue(Property.KEY_SEMANTICS_GLOSSARY);
		if (glossary==null) {
			glossary="";
		}
		text.append(glossary);

		LexicalCategory category = impression.getLexicalCategory();
		String categoryCode = category == null ? "none" : category.getCode();
		Language language = impression.getLanguage();
		String languageCode = language == null ? "none" : language.getCode();

		Document doc = new Document();
		doc.add(new TextField("text", text.toString(), Field.Store.YES));
		doc.add(new TextField("word", word.getText(), Field.Store.YES));
		doc.add(new TextField("glossary", glossary, Field.Store.YES));
		doc.add(new TextField("language", languageCode, Field.Store.YES));
		doc.add(new TextField("category", categoryCode, Field.Store.YES));
		doc.add(new TextField("letter", getLetter(word.getText()), Field.Store.YES));
		return doc;
	}

	private String getLetter(String text) {
		String letter = Strings.getAlphabethStartLetter(text);
		return letter;
	}
	
	public Document build(WordListPerspective perspective) throws ModelException {
		StringBuilder text = new StringBuilder(perspective.getText());
		if (Strings.isNotBlank(perspective.getGlossary())) {
			text.append(" ").append(perspective.getGlossary());
		}

		Document doc = new Document();
		doc.add(new TextField("text", text.toString(), Field.Store.YES));
		doc.add(new TextField("word", Strings.asNonNull(perspective.getText()), Field.Store.YES));
		doc.add(new TextField("glossary", Strings.asNonNull(perspective.getGlossary()), Field.Store.YES));
		doc.add(new TextField("language", Strings.asNonBlank(perspective.getLanguage(),"none"), Field.Store.YES));
		doc.add(new TextField("category", Strings.asNonBlank(perspective.getLexicalCategory(),"none"), Field.Store.YES));
		doc.add(new TextField("letter", getLetter(perspective.getText()), Field.Store.YES));
		return doc;
	}
	
	public void setLanguageService(LanguageService languageService) {
		this.languageService = languageService;
	}
}
