package dk.in2isoft.onlineobjects.modules.information;

import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import com.sun.syndication.feed.rss.Item;

import dk.in2isoft.commons.lang.Counter;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.NetworkException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspectiveQuery;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.modules.scheduling.JobStatus;
import dk.in2isoft.onlineobjects.modules.surveillance.SurveillanceService;
import dk.in2isoft.onlineobjects.services.FeedService;
import dk.in2isoft.onlineobjects.services.LanguageService;
import dk.in2isoft.onlineobjects.services.SemanticService;

public class InformationService {

	private static final Logger log = Logger.getLogger(InformationService.class);
	
	private FeedService feedService;
	private SemanticService semanticService;
	private LanguageService languageService;
	private ModelService modelService;
	private SecurityService securityService;
	private SurveillanceService surveillanceService;
	private HTMLService htmlService;
	
	public void clearUnvalidatedWords() throws ModelException {
		User admin = modelService.getUser(SecurityService.ADMIN_USERNAME);
		Query<Word> query = Query.after(Word.class).withCustomProperty(Property.KEY_DATA_VALIDATED, "false");
		List<Word> list = modelService.list(query);
		for (Word word : list) {
			try {
				modelService.deleteEntity(word, admin);
				modelService.commit();
			} catch (SecurityException e) {
				log.warn("Unable to delete word: "+word);
			}
		}
	}

	
	public void importInformation(String feed, JobStatus status) {
		try {
			User admin = modelService.getUser(SecurityService.ADMIN_USERNAME);
			surveillanceService.logInfo("Checking feed", feed);
			List<Item> items = feedService.getFeedItems(feed);
			if (items==null) {
				surveillanceService.logInfo("No items in feed", feed);
				status.error("Unable to parse feed: "+feed);
				return;
			}
			for (Item item : items) {
				String link = item.getLink();
				if (Strings.isBlank(link)) {
					status.warn("Feed item has no link: "+item.getTitle());
					continue;
				}
				String abreviated = StringUtils.abbreviateMiddle(link, "...", 100);
				
				Long num = modelService.count(Query.after(InternetAddress.class).withField(InternetAddress.FIELD_ADDRESS, link));

				if (num>0) {
					status.log("Internet address already exists: "+abreviated);
					modelService.commit();
					continue;
				}
				status.log("Fetching: "+abreviated);
				HTMLDocument doc = htmlService.getDocumentSilently(link);
				if (doc==null) {
					status.log("Unable to get HTML document: "+abreviated);
					modelService.commit();
					continue;
				}
				String contents = doc.getExtractedContents();
				
				
				InternetAddress internetAddress = new InternetAddress();
				internetAddress.setAddress(link);
				internetAddress.setName(doc.getTitle());
				internetAddress.addProperty(Property.KEY_INTERNETADDRESS_CONTENT, StringUtils.abbreviate(contents, 3990));
				modelService.createItem(internetAddress, admin);
				
				if (Strings.isBlank(contents)) {
					status.warn("No content: "+link);
				} else {
				
					String[] allWords = semanticService.getWords(contents);
					semanticService.lowercaseWords(allWords);
					List<String> uniqueWords = Lists.newArrayList(semanticService.getUniqueWords(allWords));
					
					
					// Ignore malformed words
					String[] chars = {"'","-","’"};
					
					for (Iterator<String> i = uniqueWords.iterator(); i.hasNext();) {
						String string = i.next();
						for (String symbol : chars) {
							if (string.startsWith(symbol) || string.endsWith(symbol)) {
								i.remove();
								break;
							}						
						}
					}
					
					
					WordListPerspectiveQuery perspectiveQuery = new WordListPerspectiveQuery().withWords(uniqueWords).orderByText();
					List<WordListPerspective> list = modelService.list(perspectiveQuery);
					Set<String> found = Sets.newHashSet();
					for (WordListPerspective perspective : list) {
						String foundLower = perspective.getText().toLowerCase();
						found.add(foundLower);
					}
					int wordsCreated = 0;
					Counter<String> languages = languageService.countLanguages(list);
					String topLanguage = languages.getTop();
					//Locale locale = languageService.getLocaleForCode(topLanguage);
					for (String wordStr : uniqueWords) {
						if (!found.contains(wordStr)) {
							Word word = new Word();
							word.setText(wordStr);
							word.addProperty(Property.KEY_DATA_VALIDATED, "false");
							word.addProperty(Property.KEY_WORD_SUGGESTION_LANGUAGE, topLanguage);
							
							modelService.createItem(word, admin);
							securityService.grantPublicPrivileges(word, true, false, false);
							status.log("New word found: "+word);
							
							modelService.createRelation(internetAddress, word, Relation.KIND_COMMON_SOURCE, admin);
							wordsCreated++;
						}
					}
					surveillanceService.logInfo("Imported webpage", "Title: "+StringUtils.abbreviateMiddle(doc.getTitle(),"...", 50)+" - words: "+wordsCreated);
				}
				modelService.commit();
				//break;
			}
		} catch (NetworkException e) {
			status.error("Unable to fetch feed: "+feed,e);
		} catch (ModelException e) {
			status.error("Failed to persist something",e);			
		} finally {
			modelService.commit();
		}
	}
	
	public void setFeedService(FeedService feedService) {
		this.feedService = feedService;
	}
	
	public void setSemanticService(SemanticService semanticService) {
		this.semanticService = semanticService;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setLanguageService(LanguageService languageService) {
		this.languageService = languageService;
	}
	
	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
	
	public void setSurveillanceService(SurveillanceService surveillanceService) {
		this.surveillanceService = surveillanceService;
	}
	
	public void setHtmlService(HTMLService htmlService) {
		this.htmlService = htmlService;
	}
}
