package dk.in2isoft.onlineobjects.tasks;

import java.io.File;
import java.io.IOException;
import java.net.URI;
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

import com.google.common.collect.Sets;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.modules.language.WordModification;
import dk.in2isoft.onlineobjects.modules.language.WordService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTask;
import edu.mit.jwi.Dictionary;
import edu.mit.jwi.IDictionary;
import edu.mit.jwi.item.IIndexWord;
import edu.mit.jwi.item.IWord;
import edu.mit.jwi.item.IWordID;
import edu.mit.jwi.item.POS;

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
	
	@Before
	public void before() {
		//words.add("cat");
		//words.add("dog");
		//skip = 85593;
		rows = 10;
		//words.add("'s Gravenhage".toLowerCase());
		updateLocally = true;
		
		category = POS.VERB;
		categoryCode = LexicalCategory.CODE_VERBUM;
		
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
					callServer(mod);
				}
			}
		}
	}

	private float percent(int total, int num) {
		return Math.round(((float)num)/((float)total)*100*100)/(float)100;
	}
	
	private void callServer(WordModification modification) {
		String secret = getProperty("remoteApiSecret");
		if (Strings.isBlank(secret)) {
			log.error("No secret");
			return;
		}
		String url = getProperty("remoteApiUrl");
		if (Strings.isBlank(url)) {
			log.error("No url");
			return;
		}
		
		if (!url.endsWith("/")) {
			url += "/";
		}
		url += "v1.0/words/import";
		
		
		HttpUriRequest method = RequestBuilder.post()
                .setUri(URI.create(url))
                .addParameter("secret", secret)
                .addParameter("modification", Strings.toJSON(modification))
                .build();
		
		CloseableHttpClient client = HttpClients.createDefault();
		
		log.info("Calling server:" + modification.text);
		try (CloseableHttpResponse response = client.execute(method)) {
			int statusCode = response.getStatusLine().getStatusCode();
			if (statusCode == 200) {
				log.info("Success from server:" + modification.text);
			} else {
				log.info("Failure from server: " + statusCode);
			}
		} catch (IOException e) {
			log.error("Error calling server", e);
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