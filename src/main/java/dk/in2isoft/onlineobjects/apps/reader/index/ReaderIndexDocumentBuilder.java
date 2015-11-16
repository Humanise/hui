package dk.in2isoft.onlineobjects.apps.reader.index;

import java.io.File;
import java.util.List;

import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.LongField;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;

import dk.in2isoft.commons.lang.Files;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Pile;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.index.IndexDocumentBuilder;
import dk.in2isoft.onlineobjects.services.PileService;
import dk.in2isoft.onlineobjects.services.StorageService;

public class ReaderIndexDocumentBuilder implements IndexDocumentBuilder<InternetAddress> {

	private StorageService storageService;
	private ModelService modelService;
	private SecurityService securityService;
	private PileService pileService;
	
	public Document build(InternetAddress address) throws ModelException {
		
		Document doc = new Document();
		doc.add(new TextField("title", Strings.asNonBlank(address.getName(),"blank"), Field.Store.YES));
		HTMLDocument html = getHTMLDocument(address);
		StringBuilder text = new StringBuilder();
		if (html!=null) {
			text.append(html.getExtractedText());
		}
		
		Privileged admin = securityService.getAdminPrivileged();
		List<Word> words = modelService.getChildren(address, Word.class,admin);
		StringBuilder wordText = new StringBuilder();
		for (Word word : words) {
			if (wordText.length()>0) {
				wordText.append(" ");
			}
			wordText.append(word.getText());
			doc.add(new StringField("word", String.valueOf(word.getId()), Field.Store.NO));
		}
		doc.add(new TextField("words", wordText.toString(), Field.Store.NO));

		User owner = modelService.getOwner(address);

		Query<Person> authors = Query.of(Person.class).from(address, Relation.KIND_COMMON_AUTHOR).withPrivileged(owner);
		List<Person> people = modelService.list(authors);
		for (Person person : people) {
			doc.add(new StringField("author", String.valueOf(person.getId()), Field.Store.NO));
			text.append(" ").append(person.getFullName());
		}
		doc.add(new TextField("text", Strings.asNonBlank(text.toString(),""), Field.Store.NO));

		
		Pile inbox = pileService.getOrCreatePileByRelation(owner, Relation.KIND_SYSTEM_USER_INBOX);
		Pile favorites = pileService.getOrCreatePileByRelation(owner, Relation.KIND_SYSTEM_USER_FAVORITES);
		
		boolean inboxed = false;
		boolean favorited = false;
		
		List<Pile> piles = modelService.getParents(address, Pile.class, owner);
		for (Pile pile : piles) {
			if (pile.getId()==inbox.getId()) {
				inboxed = true;
			} else if (pile.getId()==favorites.getId()) {
				favorited = true;
			}
		}
		
		doc.add(new TextField("inbox", inboxed ? "yes" : "no", Field.Store.YES));
		doc.add(new TextField("favorite", favorited ? "yes" : "no", Field.Store.YES));
		doc.add(new LongField("updated", address.getUpdated().getTime(), Field.Store.YES));
		doc.add(new LongField("created", address.getCreated().getTime(), Field.Store.YES));
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

	public void setPileService(PileService pilService) {
		this.pileService = pilService;
	}
}
