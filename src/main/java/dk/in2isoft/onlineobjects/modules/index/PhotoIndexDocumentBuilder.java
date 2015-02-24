package dk.in2isoft.onlineobjects.modules.index;

import java.util.List;
import java.util.Set;

import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.IntField;
import org.apache.lucene.document.LongField;
import org.apache.lucene.document.TextField;

import com.google.common.collect.Sets;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Privilege;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Word;

public class PhotoIndexDocumentBuilder implements IndexDocumentBuilder<Image> {
	
	private ModelService modelService;
	private SecurityService securityService;
	
	public Document build(Image image) throws ModelException {
		
		StringBuilder text = new StringBuilder();
		text.append(image.getName()).append(" ");
		String glossary = image.getPropertyValue(Image.PROPERTY_DESCRIPTION);
		if (Strings.isNotBlank(glossary)) {
			text.append(" ").append(glossary);
		}
		text.append(glossary);
		
		Document doc = new Document();
		doc.add(new TextField("text", text.toString(), Field.Store.YES));
		doc.add(new TextField("type", image.getType(), Field.Store.YES));
		doc.add(new LongField("fileSize", image.getFileSize(), Field.Store.YES));
		doc.add(new IntField("width", image.getWidth(), Field.Store.YES));
		doc.add(new IntField("height", image.getHeight(), Field.Store.YES));

		Set<Long> viewers = Sets.newHashSet();
		List<Privilege> priviledges = modelService.getPrivileges(image);
		for (Privilege privilege : priviledges) {
			if (privilege.isView()) {
				viewers.add(privilege.getSubject());
			}
		}
		for (Long id : viewers) {
			doc.add(new LongField("viewerId",id,Field.Store.YES));
		}
		List<Word> words = modelService.getChildren(image, null, Word.class);
		for (Word word : words) {
			doc.add(new TextField("word", word.getText(), Field.Store.YES));
			doc.add(new LongField("wordId",word.getId(),Field.Store.YES));
		}
		User owner = modelService.getOwner(image);
		if (owner!=null) {
			doc.add(new LongField("ownerId",owner.getId(),Field.Store.YES));
		}
		boolean publico = securityService.isPublicView(image);
		doc.add(new TextField("public",publico ? "true" : "false",Field.Store.YES));
		return doc;
	}
	
	// Wiring...
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
}
