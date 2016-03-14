package dk.in2isoft.onlineobjects.modules.information;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.eclipse.jdt.annotation.NonNull;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import com.sun.syndication.feed.rss.Item;

import dk.in2isoft.commons.http.URLUtil;
import dk.in2isoft.commons.lang.Counter;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.NetworkException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Kind;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.information.MissingSimilarityQuery.SimilarityResult;
import dk.in2isoft.onlineobjects.modules.language.TextDocumentAnalytics;
import dk.in2isoft.onlineobjects.modules.language.TextDocumentAnalyzer;
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
	private TextDocumentAnalyzer textDocumentAnalyzer;

	private Set<String> supportedLanguages = Sets.newHashSet("da", "en");

	public void clearUnvalidatedWords() throws ModelException {
		User admin = modelService.getUser(SecurityService.ADMIN_USERNAME);
		Query<Word> query = Query.after(Word.class).withCustomProperty(Property.KEY_DATA_VALIDATED, "false");
		List<Word> list = modelService.list(query);
		for (Word word : list) {
			try {
				modelService.deleteEntity(word, admin);
				modelService.commit();
			} catch (SecurityException e) {
				log.warn("Unable to delete word: " + word);
			}
		}
	}

	public void importInformation(String feed, JobStatus status) {
		try {
			User admin = modelService.getUser(SecurityService.ADMIN_USERNAME);
			surveillanceService.logInfo("Checking feed", feed);
			List<Item> items = feedService.getFeedItems(feed);
			if (items == null) {
				surveillanceService.logInfo("No items in feed", feed);
				status.error("Unable to parse feed: " + feed);
				return;
			}
			for (Item item : items) {
				String link = item.getLink();
				if (Strings.isBlank(link)) {
					status.warn("Feed item has no link: " + item.getTitle());
					continue;
				}
				String abreviated = StringUtils.abbreviateMiddle(link, "...", 100);

				Long num = modelService
						.count(Query.after(InternetAddress.class).withField(InternetAddress.FIELD_ADDRESS, link));

				if (num > 0) {
					status.log("Internet address already exists: " + abreviated);
					modelService.commit();
					continue;
				}
				status.log("Fetching: " + abreviated);
				HTMLDocument doc = htmlService.getDocumentSilently(link);
				if (doc == null) {
					status.log("Unable to get HTML document: " + abreviated);
					modelService.commit();
					continue;
				}
				String contents = doc.getExtractedText();

				InternetAddress internetAddress = new InternetAddress();
				internetAddress.setAddress(link);
				internetAddress.setName(doc.getTitle());
				internetAddress.addProperty(Property.KEY_INTERNETADDRESS_CONTENT,
						StringUtils.abbreviate(contents, 3990));
				modelService.createItem(internetAddress, admin);

				if (Strings.isBlank(contents)) {
					status.warn("No content: " + link);
				} else {
					Locale locale = languageService.getLocale(contents);
					int wordsCreated = 0;
					if (locale == null) {
						status.warn("Unable to detect language: "
								+ StringUtils.abbreviateMiddle(doc.getTitle(), "...", 50));
					} else {
						if ("no".equals(locale.getLanguage())) {
							locale = new Locale("da");
							status.warn("Using danish instead of norwegian");
						}
						if (!supportedLanguages.contains(locale.getLanguage())) {
							status.warn("Unsupported language: " + locale);
						} else {
							String[] allWords = semanticService.getNaturalWords(contents, locale);
							List<String> uniqueWords = Lists
									.newArrayList(semanticService.getUniqueWordsLowercased(allWords));

							WordListPerspectiveQuery perspectiveQuery = new WordListPerspectiveQuery()
									.withWords(uniqueWords).orderByText();
							List<WordListPerspective> list = modelService.list(perspectiveQuery);
							Set<String> found = Sets.newHashSet();
							for (WordListPerspective perspective : list) {
								found.add(perspective.getText().toLowerCase());
							}
							Counter<String> languages = languageService.countLanguages(list);
							String topLanguage = languages.getTop();
							// Locale locale =
							// languageService.getLocaleForCode(topLanguage);
							for (String wordStr : uniqueWords) {
								if (!found.contains(wordStr)) {
									Word word = new Word();
									word.setText(wordStr);
									word.addProperty(Property.KEY_DATA_VALIDATED, "false");
									word.addProperty(Property.KEY_WORD_SUGGESTION_LANGUAGE, topLanguage);

									modelService.createItem(word, admin);
									securityService.grantPublicPrivileges(word, true, false, false);
									status.log("New word found: " + word);

									modelService.createRelation(internetAddress, word, Relation.KIND_COMMON_SOURCE,
											admin);
									wordsCreated++;
								}
							}
						}
					}
					surveillanceService.logInfo("Imported webpage", "Title: "
							+ StringUtils.abbreviateMiddle(doc.getTitle(), "...", 50) + " - words: " + wordsCreated);
				}
				modelService.commit();
				// break;
			}
		} catch (NetworkException e) {
			status.error("Unable to fetch feed: " + feed, e);
		} catch (ModelException e) {
			status.error("Failed to persist something", e);
		} finally {
			modelService.commit();
		}
	}

	public InternetAddress addInternetAddress(String url, Privileged privileged) throws ModelException {
		if (!URLUtil.isValidHttpUrl(url)) {
			throw new IllegalArgumentException("URL not valid: " + url);
		}
		InternetAddress internetAddress = new InternetAddress();
		internetAddress.setAddress(url);
		HTMLDocument doc = htmlService.getDocumentSilently(url);
		if (doc != null) {
			internetAddress.setName(doc.getTitle());
		} else {
			internetAddress.setName(Strings.simplifyURL(url));
		}
		modelService.createItem(internetAddress, privileged);
		return internetAddress;
	}

	public void calculateNextMissingSimilary(JobStatus status) {
		try {
			@NonNull
			Privileged admin = securityService.getAdminPrivileged();
			MissingSimilarityQuery simQuery = new MissingSimilarityQuery();
			List<SimilarityResult> results = modelService.list(simQuery);
			int index = 0;
			int total = results.size();
			for (SimilarityResult pair : results) {

				User privileged = modelService.get(User.class, pair.getUserId(), admin);
				status.log("Found missing similarity (user=" + privileged.getUsername() + ")");
				status.setProgress(index, total);
				status.log("Loading entities");
				InternetAddress a = modelService.get(InternetAddress.class, pair.getFirstId(), privileged);
				InternetAddress b = modelService.get(InternetAddress.class, pair.getSecondId(), privileged);

				status.log("Building analytics");
				TextDocumentAnalytics analyticsA = textDocumentAnalyzer.analyze(a, privileged);
				TextDocumentAnalytics analyticsB = textDocumentAnalyzer.analyze(b, privileged);
				double similarity;
				if (analyticsA!=null && analyticsB!=null) {
					List<String> tokensA = getTokens(analyticsA);
					List<String> tokensB = getTokens(analyticsB);

					status.log("Comparing: " + tokensA.size() + "/" + tokensB.size());

					similarity = semanticService.compare(tokensA, tokensB);					
				} else {
					status.log("One of the two where null");
					similarity = 0;
				}

				status.log("Saving similarity");
				createSimilarity(a, b, similarity, privileged);

				status.log(a.getName() + " vs " + b.getName() + " = " + similarity);
				index++;
			}
		} catch (ModelException e) {
			status.error("Error while calculating similarity", e);
		} finally {
			modelService.commit();
		}
	}

	private void createSimilarity(InternetAddress a, InternetAddress b, double similarity, Privileged privileged)
			throws ModelException {
		Relation a2b = modelService.getRelation(a, b, Kind.similarity.toString());
		Relation b2a = modelService.getRelation(b, a, Kind.similarity.toString());

		// TODO Make sure there is exactly 1 relation
		if (a2b == null && b2a == null) {
			Relation relation = new Relation(a, b);
			relation.setStrength(similarity);
			relation.setKind(Kind.similarity);
			modelService.createItem(relation, privileged);
		}

	}

	private List<String> getTokens(TextDocumentAnalytics candidate) {
		if (candidate==null || candidate.getSignificantWords() == null) {
			return new ArrayList<>();
		}
		return candidate.getSignificantWords().stream()
				.map((part) -> part.getPartOfSpeech() + "_" + part.getText().toLowerCase())
				.collect(Collectors.toList());
	}

	// Wiring...

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

	public void setTextDocumentAnalyzer(TextDocumentAnalyzer textDocumentAnalyzer) {
		this.textDocumentAnalyzer = textDocumentAnalyzer;
	}
}
