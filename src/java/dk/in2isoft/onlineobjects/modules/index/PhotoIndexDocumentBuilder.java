package dk.in2isoft.onlineobjects.modules.index;

import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.IntField;
import org.apache.lucene.document.LongField;
import org.apache.lucene.document.TextField;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Image;

public class PhotoIndexDocumentBuilder implements IndexDocumentBuilder<Image> {
	
	public Document build(Image word) throws ModelException {
		
		StringBuilder text = new StringBuilder();
		text.append(word.getName()).append(" ");
		String glossary = word.getPropertyValue(Image.PROPERTY_DESCRIPTION);
		if (Strings.isNotBlank(glossary)) {
			text.append(" ").append(glossary);
		}
		text.append(glossary);

		
		Document doc = new Document();
		doc.add(new TextField("text", text.toString(), Field.Store.YES));
		doc.add(new TextField("type", word.getType(), Field.Store.YES));
		doc.add(new LongField("fileSize", word.getFileSize(), Field.Store.YES));
		doc.add(new IntField("width", word.getWidth(), Field.Store.YES));
		doc.add(new IntField("height", word.getHeight(), Field.Store.YES));
		return doc;
	}
}
