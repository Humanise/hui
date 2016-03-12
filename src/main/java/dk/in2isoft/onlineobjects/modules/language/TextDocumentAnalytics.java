package dk.in2isoft.onlineobjects.modules.language;

import java.io.Serializable;
import java.util.List;
import java.util.Locale;
import java.util.Map.Entry;

import dk.in2isoft.onlineobjects.core.Pair;

public class TextDocumentAnalytics implements Serializable {
	
	private static final long serialVersionUID = -801269486410776021L;

	private String documentTitle;
	private String xml;
	private String text;
	private String html;
	private List<String> sentences;
	private List<String> simpleWords;
	private List<String> naturalWords;
	private Locale guessedLocale;
	private Locale usedLocale;
	private List<Pair<String, Integer>> wordFrequency;
	private List<List<String>> nameCandidates;
	private List<List<TextPart>> taggedSentences;
	private List<TextPart> significantWords;
	private List<Pair<TextPart, Integer>> significantWordFrequency;
	
	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getHtml() {
		return html;
	}

	public void setHtml(String html) {
		this.html = html;
	}

	public List<String> getSentences() {
		return sentences;
	}

	public void setSentences(List<String> sentences) {
		this.sentences = sentences;
	}

	public List<String> getSimpleWords() {
		return simpleWords;
	}

	public void setSimpleWords(List<String> simpleWords) {
		this.simpleWords = simpleWords;
	}

	public List<String> getNaturalWords() {
		return naturalWords;
	}

	public void setNaturalWords(List<String> naturalWords) {
		this.naturalWords = naturalWords;
	}

	public String getDocumentTitle() {
		return documentTitle;
	}

	public void setDocumentTitle(String documentTitle) {
		this.documentTitle = documentTitle;
	}

	public Locale getGuessedLocale() {
		return guessedLocale;
	}

	public void setGuessedLocale(Locale guessedLocale) {
		this.guessedLocale = guessedLocale;
	}

	public Locale getUsedLocale() {
		return usedLocale;
	}

	public void setUsedLocale(Locale usedLocale) {
		this.usedLocale = usedLocale;
	}

	public List<List<String>> getNameCandidates() {
		return nameCandidates;
	}

	public void setNameCandidates(List<List<String>> nameCandidates) {
		this.nameCandidates = nameCandidates;
	}

	public List<List<TextPart>> getTaggedSentences() {
		return taggedSentences;
	}

	public void setTaggedSentences(List<List<TextPart>> taggedSentences) {
		this.taggedSentences = taggedSentences;
	}

	public List<TextPart> getSignificantWords() {
		return significantWords;
	}

	public void setSignificantWords(List<TextPart> significantWords) {
		this.significantWords = significantWords;
	}

	public List<Pair<TextPart, Integer>> getSignificantWordFrequency() {
		return significantWordFrequency;
	}

	public void setSignificantWordFrequency(List<Pair<TextPart, Integer>> significantWordFrequency2) {
		this.significantWordFrequency = significantWordFrequency2;
	}

	public List<Pair<String, Integer>> getWordFrequency() {
		return wordFrequency;
	}

	public void setWordFrequency(List<Pair<String, Integer>> wordFrequency) {
		this.wordFrequency = wordFrequency;
	}

	public String getXml() {
		return xml;
	}

	public void setXml(String xml) {
		this.xml = xml;
	}
}
