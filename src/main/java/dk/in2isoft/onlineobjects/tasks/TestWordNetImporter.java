package dk.in2isoft.onlineobjects.tasks;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.WordModification;
import dk.in2isoft.onlineobjects.modules.language.WordRelationModification;
import dk.in2isoft.onlineobjects.modules.language.WordService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTask;
import edu.mit.jwi.Dictionary;
import edu.mit.jwi.IDictionary;
import edu.mit.jwi.item.IIndexWord;
import edu.mit.jwi.item.ISynset;
import edu.mit.jwi.item.ISynsetID;
import edu.mit.jwi.item.IWord;
import edu.mit.jwi.item.IWordID;
import edu.mit.jwi.item.POS;
import edu.mit.jwi.item.Pointer;
import edu.mit.jwi.item.Synset;
import edu.mit.jwi.item.WordID;

public class TestWordNetImporter extends AbstractSpringTask {
	
	
	private POS category = POS.NOUN;
	private String categoryCode = LexicalCategory.CODE_NOMEN;

	private static final Logger log = LoggerFactory.getLogger(TestWordNetImporter.class);
	
	private WordService wordService;
	private SecurityService securityService;
	
	private Set<String> words = Sets.newHashSet(); //"acacia"
	int skip = 0;
	int rows = Integer.MAX_VALUE;
	private boolean updateLocally;
	private boolean updateBaseInfo;
	private boolean updateRelations;
	
	@Before
	public void before() {
		//words.add("cat");
		words.add("frank");
		//skip = 9755;
		//rows = 20;
		//words.add("'s Gravenhage".toLowerCase());
		updateRelations = true;
		
		category = POS.NOUN;
		categoryCode = LexicalCategory.CODE_NOMEN;
		
		//words.add("java");
	}
	
	@Test
	public void run() throws Exception {
		File file = new File(getProperty("wordNetDataDir"));
		IDictionary dict = new Dictionary(file);
		dict.open();
		
		Privileged privileged = securityService.getAdminPrivileged();
		int total = 0;
		{
			Iterator<IIndexWord> wordIterator = dict.getIndexWordIterator(category);
			while (wordIterator.hasNext()) {
				wordIterator.next();
				total++;
			}
		}
		int num = 0;
		Iterator<IIndexWord> wordIterator = dict.getIndexWordIterator(category);
		for (;wordIterator.hasNext() && skip>0; skip--) {
			wordIterator.next();
			num++;
		}
		List<WordModification> wordModifications = Lists.newArrayList();
		//List<WordRelationModification> relationModifications = Lists.newArrayList();
		for (;wordIterator.hasNext() && rows>0; rows--) {
			num++;
			
			IIndexWord indexWord = wordIterator.next();
			
			String root = getText(indexWord.getLemma());
			if (!words.isEmpty() && !words.contains(root.toLowerCase())) {
				continue;
			}
			print(num + " of " + total + " = " + percent(total, num) + "%");
			print("Root : " + root);
			
			List<IWordID> wordIDs = indexWord.getWordIDs();
			for (IWordID wordID : wordIDs) {
				IWord word = dict.getWord(wordID);
				
				print("· Word : " + getText(word.getLemma()));
				print("· · Glossary: " + word.getSynset().getGloss());
				print("· · ID: " + wordID);
				
				if (updateBaseInfo) {
					WordModification mod = new WordModification();
					mod.source = "http://wordnet.princeton.edu";
					mod.sourceId = wordID.toString(); // TODO
					mod.text = getText(word.getLemma());
					mod.language = Language.ENGLISH;
					mod.lexicalCategory = categoryCode;
					mod.glossary = word.getSynset().getGloss();
					if (updateLocally) {
						wordService.updateWord(mod,privileged);
						modelService.commit();
					} else {
						wordModifications.add(mod);
						if (wordModifications.size()>=10) {
							boolean success = callServer(wordModifications);
							while (!success) {
								print("Server failed, trying again...");
								Thread.sleep(1000 * 5);
								success = callServer(wordModifications);
							}
							wordModifications.clear();
						}
					}
				}
				if (updateRelations) {
					List<IWord> wordsFromSameSynset = word.getSynset().getWords();
					for (IWord wordFromSynset : wordsFromSameSynset) {
						print("· · Synonym: " + getText(wordFromSynset.getLemma()));
						
						WordRelationModification modification = WordRelationModification.create(getSourceId(word.getID()),Relation.KIND_SEMANTICS_SYNONYMOUS,getSourceId(wordFromSynset.getID()));
						update(modification);
						modelService.commit();
					}
					Collection<Pointer> pointers = Pointer.values();
					for (Pointer pointer : pointers) {
						List<IWordID> hypernyms = word.getRelatedWords(pointer);
						for (IWordID hypernymId : hypernyms) {
							IWord hypernym = dict.getWord(hypernymId);
							print("· · " + pointer.getName() + ": " + getText(hypernym.getLemma()));
						}
						
					}
					for (Pointer pointer : pointers) {
						List<ISynsetID> relatedSynsets = word.getSynset().getRelatedSynsets(pointer);
						for (ISynsetID relatedSynsetId : relatedSynsets) {
							ISynset relatedSynset = dict.getSynset(relatedSynsetId);
							String wds = relatedSynset.getWords().stream().map((a) -> getText(a.getLemma())).reduce("", (a,b) -> {return a.length()>0 ? a + "," + b : b;});
							print("· · " + pointer.getName() + ": " + wds);
						}
						
					}
				}
			}
		}
		if (updateBaseInfo) {
			if (!updateLocally && !wordModifications.isEmpty()) {
				callServer(wordModifications);
			}
		}
	}
	
    private String getSourceId(IWordID wordID) {
    	StringBuilder sb = new StringBuilder();
    	sb.append(WordID.wordIDPrefix);
    	sb.append(Synset.zeroFillOffset(wordID.getSynsetID().getOffset()));
    	sb.append('-');
    	sb.append(Character.toUpperCase(wordID.getPOS().getTag()));
    	sb.append('-');
    	sb.append(WordID.unknownWordNumber);
        sb.append('-');
        sb.append(wordID.getLemma());
        return sb.toString();
    }
	
	private void update(WordRelationModification modification) throws ModelException, SecurityException {
		Privileged admin = securityService.getAdminPrivileged();
		Word from = wordService.getWordBySourceId(modification.getFromSourceId(), admin);
		if (from==null) {
			return;
		}
		Word to = wordService.getWordBySourceId(modification.getToSourceId(), admin);
		if (to==null) {
			return;
		}
		String kind = modification.getRelationKind();
		boolean bidirectional = Relation.KIND_SEMANTICS_SYNONYMOUS.equals(kind);
		if (modelService.getRelation(from, to, kind)!=null) {
			return;
		}
		if (bidirectional && modelService.getRelation(to, from, kind)!=null) {
			return;
		}
		Relation relation = modelService.createRelation(from, to, kind, admin);
		securityService.makePublicVisible(relation, admin);
	}

	private float percent(int total, int num) {
		return Math.round(((float)num)/((float)total)*100*100)/(float)100;
	}
	
	private boolean callServer(List<WordModification> modification) {
		String secret = getProperty("remoteApiSecret");
		if (Strings.isBlank(secret)) {
			log.error("No secret");
			return false;
		}
		String url = getProperty("remoteApiUrl");
		if (Strings.isBlank(url)) {
			log.error("No url");
			return false;
		}
		
		if (!url.endsWith("/")) {
			url += "/";
		}
		url += "v1.0/words/import";
		
		
		HttpUriRequest method = RequestBuilder.post()
                .setUri(URI.create(url))
                .addParameter("secret", secret)
                .addParameter("modifications", Strings.toJSON(modification))
                .build();
		
		CloseableHttpClient client = HttpClients.createDefault();
		
		log.info("Calling server:" + modification.size());
		try (CloseableHttpResponse response = client.execute(method)) {
			int statusCode = response.getStatusLine().getStatusCode();
			if (statusCode == 200) {
				log.info("Success from server:" + modification.size());
				return true;
			} else {
				log.info("Failure from server: " + statusCode);
				return false;
			}
		} catch (IOException e) {
			log.error("Error calling server", e);
			return false;
			}
	}

	private void print(String msg) {
		System.out.println(msg);
	}
	
	private String getText(String lemma) {
		return lemma.replaceAll("[_]+", " ");
	}
	
	@Autowired
	public void setWordService(WordService wordService) {
		this.wordService = wordService;
	}
	
	@Autowired
	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
}