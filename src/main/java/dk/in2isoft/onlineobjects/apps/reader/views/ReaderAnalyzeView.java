package dk.in2isoft.onlineobjects.apps.reader.views;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.commons.xml.DOM;
import dk.in2isoft.commons.xml.DocumentCleaner;
import dk.in2isoft.commons.xml.DocumentToText;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.modules.caching.CacheService;
import dk.in2isoft.onlineobjects.modules.information.ContentExtractor;
import dk.in2isoft.onlineobjects.modules.information.SimpleContentExtractor;
import dk.in2isoft.onlineobjects.modules.networking.InternetAddressService;
import dk.in2isoft.onlineobjects.services.LanguageService;
import dk.in2isoft.onlineobjects.services.SemanticService;
import dk.in2isoft.onlineobjects.ui.Request;
import nu.xom.Document;

public class ReaderAnalyzeView extends AbstractView implements InitializingBean {
	
	private ModelService modelService;
	private InternetAddressService internetAddressService;
	private SemanticService semanticService;
	private LanguageService languageService;
	private CacheService cacheService;
	
	private InternetAddress internetAddress;
	private String text;
	private String html;
	private String[] simpleWords;
	
	private List<Pair<String,Object>> properties;
	private Locale locale;
	private String[] sentences;
	private String[] naturalWords;
	private List<Entry<String, Integer>> wordFrequency;
	private ArrayList<Object> taggedSentences;
	
	public ReaderAnalyzeView() {
		properties = Lists.newArrayList();
	}
	
	@Override
	public void afterPropertiesSet() throws Exception {
		Request request = getRequest();
		Long id = request.getId();
		Privileged privileged = request.getSession();
		internetAddress = modelService.getRequired(InternetAddress.class, id, privileged);
		
		
		HTMLDocument htmlDocument = internetAddressService.getHTMLDocument(internetAddress, privileged);
		
		properties.add(Pair.of("Entity name", internetAddress.getName()));
		properties.add(Pair.of("Entity address", internetAddress.getAddress()));
		for (Property property : internetAddress.getProperties()) {
			properties.add(Pair.of(property.getKey(), property.getValue()));
		}
		properties.add(Pair.of("Document title", htmlDocument.getTitle()));
		properties.add(Pair.of("Document content type", htmlDocument.getContentType()));
		
		Document xom = htmlDocument.getXOMDocument();
		ContentExtractor extractor = new SimpleContentExtractor();
		Document extracted = extractor.extract(xom);

		DocumentCleaner cleaner = new DocumentCleaner();
		cleaner.setUrl(internetAddress.getAddress());
		cleaner.clean(extracted);
		
		DocumentToText doc2txt = new DocumentToText();
		text = doc2txt.getText(extracted);
		html = DOM.getBodyXML(extracted);

		locale = languageService.getLocale(text);
		properties.add(Pair.of("Locale (analyzed)", locale.toString()));

		simpleWords = semanticService.getWords(text);
		
		naturalWords = semanticService.getNaturalWords(text, locale);
		
		wordFrequency = semanticService.getWordFrequency(naturalWords).entrySet().stream().sorted((a,b) -> {return b.getValue().compareTo(a.getValue());}).collect(Collectors.toList());
		
		sentences = semanticService.getSentences(text, locale);
		
		taggedSentences = Lists.newArrayList(); 
		for (String sentence : sentences) {
			List<TextPart> tagged = new ArrayList<>();
			String[] tokens = semanticService.getTokensAsString(sentence, locale);
			String[] partOfSpeach = semanticService.getPartOfSpeach(tokens, locale);
			for (int i = 0; i < tokens.length; i++) {
				tagged.add(new TextPart(tokens[i],partOfSpeach[i]));
			}
			taggedSentences.add(tagged);
		}
	}
	
	public static class TextPart {
		private String text;
		private String partOfSpeech;

		public TextPart(String text, String pos) {
			this.text = text;
			this.partOfSpeech = pos;
		}
		
		public String getText() {
			return text;
		}
		
		public String getPartOfSpeech() {
			return partOfSpeech;
		}
	}
			

	public String getTitle() {
		return internetAddress.getName();
	}
	
	public List<Pair<String, Object>> getProperties() {
		return properties;
	}
	
	public String getText() {
		return text;
	}
	
	public String getHtml() {
		return html;
	}
	
	public String[] getSimpleWords() {
		return simpleWords;
	}
	
	public String[] getNaturalWords() {
		return naturalWords;
	}
	
	public String[] getSentences() {
		return sentences;
	}
	
	public ArrayList<Object> getTaggedSentences() {
		return taggedSentences;
	}

	// Wiring...
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setInternetAddressService(InternetAddressService internetAddressService) {
		this.internetAddressService = internetAddressService;
	}
	
	public void setSemanticService(SemanticService semanticService) {
		this.semanticService = semanticService;
	}
	
	public void setLanguageService(LanguageService languageService) {
		this.languageService = languageService;
	}
	
	public void setCacheService(CacheService cacheService) {
		this.cacheService = cacheService;
	}
}
