package dk.in2isoft.onlineobjects.modules.index;

import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.TextField;

import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.WordImpression;
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
		return doc;
	}
	
	public void setLanguageService(LanguageService languageService) {
		this.languageService = languageService;
	}
}
