package dk.in2isoft.onlineobjects.modules.language;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map.Entry;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Lists;
import com.google.common.collect.Multimap;
import com.google.common.collect.Sets;

import dk.in2isoft.commons.lang.Counter;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.commons.xml.DOM;
import dk.in2isoft.commons.xml.DocumentCleaner;
import dk.in2isoft.commons.xml.DocumentToText;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.modules.caching.CacheService;
import dk.in2isoft.onlineobjects.modules.information.ContentExtractor;
import dk.in2isoft.onlineobjects.modules.information.SimpleContentExtractor;
import dk.in2isoft.onlineobjects.modules.networking.InternetAddressService;
import dk.in2isoft.onlineobjects.services.LanguageService;
import dk.in2isoft.onlineobjects.services.SemanticService;
import nu.xom.Document;

public class TextDocumentAnalyzer {

	private InternetAddressService internetAddressService;
	private SemanticService semanticService;
	private LanguageService languageService;
	private CacheService cacheService;
	private static final Logger log = LoggerFactory.getLogger(TextDocumentAnalyzer.class);

	private Document extract(HTMLDocument htmlDocument) {
		Document xom = htmlDocument.getXOMDocument();
		ContentExtractor extractor = new SimpleContentExtractor();
		if (xom == null) {
			return null;
		}
		Document extracted = extractor.extract(xom);

		DocumentCleaner cleaner = new DocumentCleaner();
		cleaner.setUrl(htmlDocument.getOriginalUrl());
		cleaner.clean(extracted);
		return extracted;
	}

	public TextDocumentAnalytics analyze(InternetAddress address, Privileged privileged) {
		return cacheService.getCached(address, TextDocumentAnalytics.class, () -> buildAnalytics(address, privileged));
	}
	
	private TextDocumentAnalytics buildAnalytics(InternetAddress address, Privileged privileged) throws SecurityException, ModelException {
		
		HTMLDocument htmlDocument = internetAddressService.getHTMLDocument(address, privileged);

		TextDocumentAnalytics analytics = new TextDocumentAnalytics();
		analytics.setDocumentTitle(htmlDocument.getTitle());
		Document extracted = extract(htmlDocument);
		
		String text;
		if (extracted!=null) {
			analytics.setXml(extracted.toXML());
			DocumentToText doc2txt = new DocumentToText();
			text = doc2txt.getText(extracted);
			analytics.setText(text);
			analytics.setHtml(DOM.getBodyXML(extracted));
		} else {
			log.warn("Nothing extracted from " + address);
			return analytics;
		}

		Locale analyzedLocale = languageService.getLocale(text);
		Locale locale = languageService.getSupportedLocale(analyzedLocale);
		
		analytics.setGuessedLocale(analyzedLocale);
		analytics.setUsedLocale(locale);
		analytics.setSimpleWords(Lists.newArrayList(semanticService.getWords(text)));

		String[] naturalWords = semanticService.getNaturalWords(text, locale);
		{
			List<Pair<String, Integer>> wordFrequency = semanticService.getWordFrequency(naturalWords).entrySet().stream().sorted((a,b) -> {return b.getValue().compareTo(a.getValue());}).map((x)->Pair.of(x.getKey(),x.getValue())).collect(Collectors.toList());
			analytics.setWordFrequency(wordFrequency);
		}

		String[] sentences = semanticService.getSentences(text, locale);

		ArrayList<List<String>> nameCandidates = Lists.newArrayList();
		
		List<TextPart> significantWords = Lists.newArrayList();

		Counter<TextPart> significantWordCounter = new Counter<>();

		List<List<TextPart>> taggedSentences = Lists.newArrayList();
		Set<String> insignificantTags;
		Set<String> insignificantTexts = Sets.newHashSet("|","+","…","^","[","]");
		Multimap<String,String> insignificantWords = HashMultimap.create();
		if (locale.getLanguage().equals("da")) {
			insignificantTags = Sets.newHashSet("XP","SP","PD","U","CC","AC","PI","PP","CS","RG","PO","PT");
			insignificantWords.putAll("VA", Sets.newHashSet("fik","får","blive","bliver","vil","skal","ville","var","er","kan","være","har","have","lagt","været","siger","kan","blev","blevet","havde","se","ser","ses","få","fået","står","gik","lå","tyder","set","taget","stå","gå","gået","viser"));
			insignificantWords.putAll("AN", Sets.newHashSet("sådan","meget","mere","flere","mulige","tæt","alle","mest"));
			insignificantWords.putAll("NC", Sets.newHashSet("kl."));
			
		} else {
			insignificantTags = Sets.newHashSet("DT","IN","TO","-RRB-","-LRB-","CC",",",".",":","''","``","PRP$","PRP","WP","WP$","WDT","RB","WRB");
			insignificantWords.putAll("VBP", Sets.newHashSet("are"));
			insignificantWords.putAll("VBD", Sets.newHashSet("was","were","’s","we’ve"));
			insignificantWords.putAll("NNS", Sets.newHashSet("’s"));
			insignificantWords.putAll("NNP", Sets.newHashSet("that’s"));
			insignificantWords.putAll("NN", Sets.newHashSet("we’re"));
			
			insignificantWords.putAll("VB", Sets.newHashSet("be","let","go","have","do","know","give"));
			insignificantWords.putAll("VBZ", Sets.newHashSet("is","'s","has","’s"));
			insignificantWords.putAll("VBP", Sets.newHashSet("do","have","want","don’t","'ve"));
			insignificantWords.putAll("VBD", Sets.newHashSet("had","did","led"));
			insignificantWords.putAll("VBN", Sets.newHashSet("been","known"));
			insignificantWords.putAll("MD", Sets.newHashSet("can","will","'ll","'d","may", "would","should", "could", "might", "cannot", "shall", "must", "can’t", "ought"));
			insignificantWords.putAll("EX", Sets.newHashSet("there"));
			insignificantWords.putAll("RP", Sets.newHashSet("up","down","in", "back", "off", "out"));
			insignificantWords.putAll("CD", Sets.newHashSet("one"));
			insignificantWords.putAll("JJ", Sets.newHashSet("many","same","much","own","we’ve","such"));
			insignificantWords.putAll("RBR", Sets.newHashSet("more"));
			insignificantWords.putAll("POS", Sets.newHashSet("'s"));
			insignificantWords.putAll("PDT", Sets.newHashSet("all"));
			
		}
		for (String sentence : sentences) {
			List<String> NNPs = new ArrayList<>();
			List<TextPart> tagged = new ArrayList<>();
			String[] tokens = semanticService.getTokensAsString(sentence, locale);
			String[] partOfSpeach = semanticService.getPartOfSpeach(tokens, locale);
			for (int i = 0; i < tokens.length; i++) {
				String pos = partOfSpeach[i];
				String token = tokens[i];
				TextPart textPart = new TextPart(token,pos);
				boolean significant = !insignificantTags.contains(pos);
				String tokenLower = token.toLowerCase();
				significant = significant && !insignificantTexts.contains(tokenLower);
				significant = significant && !insignificantWords.containsEntry(pos, tokenLower);
				textPart.setSignificant(significant);
				if (significant) {
					significantWords.add(textPart);
					significantWordCounter.addOne(textPart);
				}
				tagged.add(textPart);
				if (isName(textPart,locale)) {
					NNPs.add(token);
				} else {
					if (!NNPs.isEmpty()) {
						nameCandidates.add(NNPs);
						NNPs = new ArrayList<>();
					}
				}
			}
			taggedSentences.add(tagged);
		}
		analytics.setSignificantWords(significantWords);
		analytics.setNameCandidates(nameCandidates);
		analytics.setNaturalWords(Lists.newArrayList(naturalWords));
		analytics.setSentences(Lists.newArrayList(sentences));
		analytics.setTaggedSentences(taggedSentences);
		
		{
			List<Pair<TextPart, Integer>> significantWordFrequency = significantWordCounter.getMap().entrySet().stream().sorted((a,b) -> {return b.getValue().compareTo(a.getValue());}).map((x) -> Pair.of(x.getKey(), x.getValue())).collect(Collectors.toList());
			analytics.setSignificantWordFrequency(significantWordFrequency);
		}
		
		return analytics;
	}

	private boolean isName(TextPart textPart, Locale locale) {
		if (locale.getLanguage().equals("da")) {
			return "NP".equals(textPart.getPartOfSpeech());
		}
		return "NNP".equals(textPart.getPartOfSpeech());
	}

	// Wiring...
	
	public void setInternetAddressService(InternetAddressService internetAddressService) {
		this.internetAddressService = internetAddressService;
	}
	
	public void setLanguageService(LanguageService languageService) {
		this.languageService = languageService;
	}
	
	public void setSemanticService(SemanticService semanticService) {
		this.semanticService = semanticService;
	}
	
	public void setCacheService(CacheService cacheService) {
		this.cacheService = cacheService;
	}
}
