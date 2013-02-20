package dk.in2isoft.onlineobjects.modules.index;

import java.util.List;

import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.TextField;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspectiveQuery;

public class WordIndexDocumentBuilder {
	
	private ModelService modelService;

	public Document build(Word word) throws ModelException {
		WordListPerspectiveQuery query = new WordListPerspectiveQuery().withIds(Lists.newArrayList(word.getId()));
		List<WordListPerspective> list = modelService.list(query);
		if (!list.isEmpty()) {
			WordListPerspective perspective = list.get(0);
			Document doc = new Document();
			StringBuilder text = new StringBuilder();
			text.append(word.getText()).append(" ");
			String glossary = word.getPropertyValue(Property.KEY_SEMANTICS_GLOSSARY);
			if (glossary==null) {
				glossary="";
			}
			String category = perspective.getLexicalCategory();
			if (category==null) {
				category = "none";
			}
			String language = perspective.getLanguage();
			if (language==null) {
				language = "none";
			}
			text.append(glossary);
			doc.add(new TextField("text", text.toString(), Field.Store.YES));
			doc.add(new TextField("word", word.getText(), Field.Store.YES));
			doc.add(new TextField("glossary", glossary, Field.Store.YES));
			doc.add(new TextField("language", language, Field.Store.YES));
			doc.add(new TextField("category", category, Field.Store.YES));
			return doc;
		}
		return null;
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
}
