package dk.in2isoft.onlineobjects.services;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.util.semantics.Language;
import opennlp.tools.postag.POSModel;
import opennlp.tools.postag.POSTaggerME;
import opennlp.tools.sentdetect.SentenceDetectorME;
import opennlp.tools.sentdetect.SentenceModel;
import opennlp.tools.tokenize.Tokenizer;
import opennlp.tools.tokenize.TokenizerME;
import opennlp.tools.tokenize.TokenizerModel;
import opennlp.tools.util.Span;

public class SemanticService {
	
	public static final String WORD_EXPRESSION = "[0-9a-zA-Z\u0027\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\\-\u02BC\u2019]+";

	public static final String QUOTES = "'\"«»’[]()-" +
		Strings.LEFT_DOUBLE_QUOTATION_MARK +
		Strings.RIGHT_DOUBLE_QUOTATION_MARK +

		Strings.LEFT_SINGLE_QUOTATION_MARK +
		Strings.RIGHT_SINGLE_QUOTATION_MARK +
		Strings.SINGLE_HIGH_REVERSED_9_QUOTATION_MARK +
		Strings.SINGLE_LOW_9_QUOTATION_MARK +
		Strings.DOUBLE_LOW_9_QUOTATION_MARK;

	
	private static final Set<String> PUNCTUATION = Sets.newHashSet(".",";",":",",","-","–");
	
	private static final Pattern NON_WORD_PATTERN = Pattern.compile("[^\\p{L}\\p{Lu}0-9]+");
	private static final Pattern NUMBER_CODE_PATTERN = Pattern.compile("[^\\p{L}\\p{Lu}]+");
	private static final Pattern MAC_PATTERN = Pattern.compile("^[a-zA-Z0-9]{2}:[a-zA-Z0-9]{2}:[a-zA-Z0-9]{2}:[a-zA-Z0-9]{2}:[a-zA-Z0-9]{2}:[a-zA-Z0-9]{2}$");
	
	private ConfigurationService configurationService;

	private static Pattern wordPattern = Pattern.compile(WORD_EXPRESSION);
	
	private static Pattern ABBREVIATION_PATTERN = Pattern.compile("[A-Z]+");
	
	private static final Logger log = Logger.getLogger(SemanticService.class);

	private static final Pattern NUMBER_WITH_UNIT_PATTERN = Pattern.compile("[0-9]+[A-Za-z]+");

	/* TODO: Use a list instead - performance */
	public String[] getWords(String text, Language language) {
		List<String> list = Lists.newArrayList();
		Matcher m = wordPattern.matcher(text);
		while (m.find()) {
			String word = m.group();
			if ("-".equals(word)) {
				continue;
			}
			if (StringUtils.isNumeric(word)) {
				continue;
			}
			if (language==null) {
				list.add(word);
			} else if (language.isWord(word) && !language.isCommonWord(word)) {
				word = language.stem(word);
				list.add(word);
			}
		}
		return list.toArray(new String[]{});
	}
	
	public boolean isAbbreviation(String word) {
		return ABBREVIATION_PATTERN.matcher(word).matches();
	}
	
	public boolean isNumberWithUnit(String word) {
		return NUMBER_WITH_UNIT_PATTERN.matcher(word).matches();
	}

	/**
	 * A regular word is an "old school" word - not a number, date, duration, length, email, ip-address etc.
	 * I.e. a "non-technical" or cryptic word.
	 * @param text
	 * @return
	 */
	public boolean isRegularWord(String text) {
		return Strings.isNotBlank(text) && !NUMBER_CODE_PATTERN.matcher(text).matches() && !isMacAddress(text) && !text.contains("@") && !isNumberWithUnit(text) && !isHashTag(text) && !isSourceTag(text);
	}
	
	public boolean isMacAddress(String text) {
		return text!=null && text.length()==17 && MAC_PATTERN.matcher(text).matches();
	}
	
	public boolean isHashTag(String text) {
		return text!=null && text.startsWith("#");
	}
	
	public boolean isSourceTag(String text) {
		return text!=null && text.startsWith("/");
	}
	
	/**
	 * Checks that a string is not pure punctuation etc.
	 * @param str
	 * @return
	 */
	public boolean isWordToken(String str) {
		if (str==null || str.length()==0) {
			return false;
		}
		return !NON_WORD_PATTERN.matcher(str).matches();
	}
	
	public String stripQuotes(String str) {
		if (str==null) {
			return null;
		}
		if (str.endsWith("..") || str.startsWith(".")) {
			str = StringUtils.strip(str, ".");
		}
		return StringUtils.strip(str, QUOTES);
	}
	
	public String stripWeirdStuff(String str) {
		if (str==null) {
			return null;
		}
		if (str.endsWith("..") || str.startsWith(".")) {
			str = StringUtils.strip(str, ".");
		}
		return StringUtils.strip(str, QUOTES);
	}
	
	public String[] getWords(String text) {
		return getWords(text, null);
	}

	public String[] getUniqueWords(String[] words) {
		List<String> list = Lists.newArrayList();
		for (String word : words) {
			if (!list.contains(word)) {
				list.add(word);
			}
		}
		return list.toArray(new String[]{});
	}

	public String[] getUniqueWordsLowercased(String[] words) {
		Set<String> list = Sets.newHashSet();
		for (String word : words) {
			list.add(word.toLowerCase());
		}
		return list.toArray(new String[]{});
	}

	public String[] getUniqueWordsWithoutPunctuation(String[] words) {
		Set<String> list = Sets.newLinkedHashSet();
		for (String word : words) {
			if (!PUNCTUATION.contains(word)) {
				list.add(word);
			}
		}
		return list.toArray(new String[]{});
	}
	
	public Map<String, Integer> getWordFrequency(String[] words) {
		final Map<String,Integer> frequency = Maps.newHashMap();
		for (String word : words) {
			if (frequency.containsKey(word)) {
				frequency.put(word, frequency.get(word)+1);
			} else {
				frequency.put(word, 1);
			}
		}
		return frequency;
	}
	
	public List<Pair<String, Integer>> getSortedWordFrequency(String[] words) {
		List<Pair<String, Integer>> list = Lists.newArrayList();
		Map<String, Integer> frequency = getWordFrequency(words);
		for (Entry<String, Integer> entry : frequency.entrySet()) {
			list.add(Pair.of(entry.getKey(), entry.getValue()));
		}
		Collections.sort(list, new Comparator<Pair<String, Integer>>() {
			public int compare(Pair<String, Integer> o1, Pair<String, Integer> o2) {
				return o2.getValue().compareTo(o1.getValue());
			}
		});
		return list;
	}

	public Map<String, Integer> getWordFrequency(String text,Language language) {
		String[] words = getWords(text,language);
		return getWordFrequency(words);
	}
	
	public double compare(String text1, String text2, Language language) {
		text1 = text1.toLowerCase();
		text2 = text2.toLowerCase();
		String[] words1 = getWords(text1,language);
		String[] words2 = getWords(text2,language);
		String[] allWords = (String[]) ArrayUtils.addAll(words1, words2);
		allWords = getUniqueWords(allWords);
		
		return compare(words1, words2);
	}
	
	public double compare(String[] words1, String[] words2) {
		String[] allWords = (String[]) ArrayUtils.addAll(words1, words2);
		allWords = getUniqueWords(allWords);

		double[] freq1 = getFrequency(allWords,words1);
		double[] freq2 = getFrequency(allWords,words2);

		double[] norm1 = normalize(freq1);
		double[] norm2 = normalize(freq2);
		
		double comparison = findDotProduct(norm1,norm2);
		if (Double.isNaN(comparison)) {
			// TODO: Maybe div-by-zero in normalize
			return 0;
		}
		return comparison;
	}

	public double compare(List<String> words1, List<String> words2) {
		return compare(Strings.toArray(words1),Strings.toArray(words2));
	}

	private double[] getFrequency(String[] keys,String[] words) {
		double[] freq = new double[keys.length];
		for (int i=0;i<words.length;i++) {
			for (int j=0;j<keys.length;j++) {
				if (words[i].equals(keys[j])) {
					freq[j]=freq[j]+1;
				}
			}
		}
		return freq;
	}
	
	private double findEuclidianNorm(double[] doc)
	{
	   double sum=0;
	   for (int i=0;i<doc.length;i++) {
	      sum+=Math.pow(doc[i],2);
	   }
	   return Math.sqrt(sum);
	}
	
	private double[] normalize(double[] doc)
	{
		int len = doc.length;
		double[] norm = new double[len];
		double euclidianNorm=findEuclidianNorm(doc);
		for (int i=0;i<len;i++) {
			norm[i]=doc[i]/euclidianNorm;
		}
		return norm;
	}
	
	private double findDotProduct(double[] query, double[] doc)
	{
		int len = query.length;
		double sum=0;
		for (int i=0;i<len;i++) {
			sum+=query[i]*doc[i];
		}
		return sum;
	}

	public void lowercaseWords(String[] words) {
		for (int i = 0; i < words.length; i++) {
			words[i] = StringUtils.lowerCase(words[i]);
		}
	}

	public String[] lowercaseWordsCopy(String[] words) {
		String[] copy = new String[words.length];
		for (int i = 0; i < words.length; i++) {
			copy[i] = StringUtils.lowerCase(words[i]);
		}
		return copy;
	}

	public List<String> lowercaseWordsCopy(List<String> words) {
		List<String> copy = Lists.newArrayList();
		for (String string : words) {
			copy.add(StringUtils.lowerCase(string));
		}
		return copy;
	}
	
	public String ensureSentenceStop(String text) {
		StringBuilder sb = new StringBuilder();
		String[] lines = text.split("[\\r\\n]+");
		for (int i = 0; i < lines.length; i++) {
			if (sb.length()>0) {
				sb.append(" ");
			}
			String line = lines[i].trim();
			sb.append(line);
			if (!line.endsWith(".")) {
				sb.append(".");
			}
		}
		return sb.toString();
	}

	public String[] getSentences(String text, Locale locale) {
		text = ensureSentenceStop(text);
		SentenceModel model = getSentenceModel(locale);
		SentenceDetectorME sentenceDetector = new SentenceDetectorME(model);
		return sentenceDetector.sentDetect(text);
	}

	public Span[] getSentencePositions(String text, Locale locale) {
		//text = ensureSentenceStop(text);
		SentenceModel model = getSentenceModel(locale);
		SentenceDetectorME sentenceDetector = new SentenceDetectorME(model);
		return sentenceDetector.sentPosDetect(text);
	}
	
	public Span[] getTokenSpans(String text, Locale locale) {
		TokenizerModel model = getTokenizerModel(locale);
		Tokenizer tokenizer = new TokenizerME(model);
		return tokenizer.tokenizePos(text);
	}
	
	public String[] getTokensAsString(String text, Locale locale) {
		TokenizerModel model = getTokenizerModel(locale);
		if (model == null) {
			return null;
		}
		Tokenizer tokenizer = new TokenizerME(model);
		return tokenizer.tokenize(text);
	}
	
	public String[] spansToStrings(Span[] spans, String text) {
		return Span.spansToStrings(spans, text);
	}
	
	public String[] getPartOfSpeach(String[] sentence, Locale locale) {
		POSModel model = getPartOfSpeachModel(locale);
		POSTaggerME tagger = new POSTaggerME(model);
		String[] tags = tagger.tag(sentence);
		return tags;
	}
	
	private final Map<Locale,SentenceModel> sentenceModels = Maps.newHashMap(); 
	
	public synchronized SentenceModel getSentenceModel(Locale locale) {
		if (sentenceModels.containsKey(locale)) {
			return sentenceModels.get(locale);
		}

		File file = configurationService.getFile("WEB-INF","data","models",locale.getLanguage()+"-sent.bin");
		if (file.exists()) {
			try (InputStream modelIn = new FileInputStream(file)){
			  SentenceModel model = new SentenceModel(modelIn);
			  sentenceModels.put(locale, model);
			  return model;
			}
			catch (IOException e) {
			  log.error("Unable to load model",e);
			}
		} else {
			sentenceModels.put(locale, null);
		}
		return null;
	}
	
	private final Map<Locale,POSModel> posModels = Maps.newHashMap(); 
	
	private synchronized POSModel getPartOfSpeachModel(Locale locale) {
		if (posModels.containsKey(locale)) {
			return posModels.get(locale);
		}
		File file = configurationService.getFile("WEB-INF","data","models",locale.getLanguage()+"-pos-maxent.bin");
		if (file.exists()) {
			try (InputStream modelIn = new FileInputStream(file)){
			  POSModel model = new POSModel(modelIn);
			  posModels.put(locale, model);
			  return model;
			}
			catch (IOException e) {
			  log.error("Unable to load model",e);
			}
		} else {
			posModels.put(locale, null);
		}
		return null;
	}
	
	private final Map<Locale,TokenizerModel> tokenizerModels = Maps.newHashMap(); 
	
	private synchronized TokenizerModel getTokenizerModel(Locale locale) {
		if (tokenizerModels.containsKey(locale)) {
			return tokenizerModels.get(locale);
		}
		File file = configurationService.getFile("WEB-INF","data","models",locale.getLanguage()+"-token.bin");
		if (file.exists()) {
			try (InputStream modelIn = new FileInputStream(file)) {
				TokenizerModel model = new TokenizerModel(modelIn);
				tokenizerModels.put(locale, model);
				return model;
			} catch (IOException e) {
				log.error("Unable to load tokenizer model", e);
			}
		} else {
			tokenizerModels.put(locale, null);
		}
		return null;
	}

	public String[] getLines(String text) {
		return text.split("\r?\n|\r");
	}

	public List<String> getUniqueNoEmptyLines(String text) {
		List<String> lines = Lists.newArrayList();
		String[] rawLines = getLines(text);
		for (String string : rawLines) {
			if (Strings.isNotBlank(string)) {
				string = string.trim();
				if (!lines.contains(string)) {
					lines.add(string);
				}
			}
		}
		return lines;
	}

	public String[] getNaturalWords(String text, Locale locale) {
		String[] tokens = getTokensAsString(text, locale);
		if (tokens==null) {
			return new String[] {};
		}
		List<String> list = Arrays.asList(tokens);
		List<String> array = list.stream().
				filter(str -> isWordToken(str)).
				map(str -> stripQuotes(str)).
				map(str -> stripWeirdStuff(str)).
				filter(str -> isRegularWord(str)).
				collect(Collectors.toList());

		return array.toArray(new String[] {});
	}
	
	
	
	// Wiring...
	
	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}
}
