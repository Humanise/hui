package dk.in2isoft.onlineobjects.apps.reader.index;

import java.io.File;
import java.util.List;

import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;

import dk.in2isoft.commons.lang.Files;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Pile;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.inbox.InboxService;
import dk.in2isoft.onlineobjects.modules.index.IndexDocumentBuilder;
import dk.in2isoft.onlineobjects.services.StorageService;

public class ReaderIndexDocumentBuilder implements IndexDocumentBuilder<InternetAddress> {

	private StorageService storageService;
	private ModelService modelService;
	private SecurityService securityService;
	private InboxService inboxService;
	
	public Document build(InternetAddress address) throws ModelException {
		
		Document doc = new Document();
		doc.add(new TextField("title", Strings.asNonBlank(address.getName(),"blank"), Field.Store.YES));
		HTMLDocument html = getHTMLDocument(address);
		String text = null;
		if (html!=null) {
			text = html.getExtractedContents();
		}
		doc.add(new TextField("text", Strings.asNonBlank(text,""), Field.Store.NO));
		Privileged admin = securityService.getAdminPrivileged();
		List<Word> words = modelService.getChildren(address, Word.class,admin);
		StringBuilder wordStr = new StringBuilder();
		for (Word word : words) {
			if (wordStr.length()>0) {
				wordStr.append(" ");
			}
			wordStr.append(word.getText());
			doc.add(new StringField("word", String.valueOf(word.getId()), Field.Store.NO));
		}
		doc.add(new TextField("words", wordStr.toString(), Field.Store.NO));

		User owner = modelService.getOwner(address);
		Pile inbox = inboxService.getOrCreateInbox(owner);
		Relation relation = modelService.getRelation(inbox, address);
		//System.out.println(relation==null);
		doc.add(new TextField("inbox", relation!=null ? "yes" : "no", Field.Store.YES));
		return doc;
	}

	
	private HTMLDocument getHTMLDocument(InternetAddress address) {
		
		File folder = storageService.getItemFolder(address);
		File original = new File(folder,"original");
		if (!original.exists()) {
			return null;
		}
		String encoding = address.getPropertyValue(Property.KEY_INTERNETADDRESS_ENCODING);
		if (Strings.isBlank(encoding)) {
			encoding = Strings.UTF8;
		}
		return new HTMLDocument(Files.readString(original, encoding));
	}
	
	public void setStorageService(StorageService storageService) {
		this.storageService = storageService;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
	
	public void setInboxService(InboxService inboxService) {
		this.inboxService = inboxService;
	}
}
