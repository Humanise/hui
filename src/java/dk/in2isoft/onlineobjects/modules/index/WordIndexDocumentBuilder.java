package dk.in2isoft.onlineobjects.modules.index;

import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.TextField;

import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Word;

public class WordIndexDocumentBuilder {

	public Document build(Word word) {
		Document doc = new Document();
		StringBuilder text = new StringBuilder();
		text.append(word.getText()).append(" ");
		String glossary = word.getPropertyValue(Property.KEY_SEMANTICS_GLOSSARY);
		if (glossary==null) {
			glossary="";
		}
		text.append(glossary);
		doc.add(new TextField("text", text.toString(), Field.Store.YES));
		doc.add(new TextField("word", word.getText(), Field.Store.YES));
		doc.add(new TextField("glossary", glossary, Field.Store.YES));
		return doc;
	}

}
