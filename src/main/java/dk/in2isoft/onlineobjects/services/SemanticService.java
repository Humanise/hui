package dk.in2isoft.onlineobjects.services;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import opennlp.tools.sentdetect.SentenceDetectorME;
import opennlp.tools.sentdetect.SentenceModel;
import opennlp.tools.util.InvalidFormatException;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.util.semantics.Language;

public class SemanticService {
	
	public static final String WORD_EXPRESSION = "[0-9a-zA-Z\u0027\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\\-\u02BC’]+";
	
	private ConfigurationService configurationService;

	private static Pattern wordPattern = Pattern.compile(WORD_EXPRESSION);
	
	private static Pattern abbrPattern = Pattern.compile("[A-Z]+");

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
		return abbrPattern.matcher(word).matches();
	}
	
	public String[] getNaturalWords(String text) {
		String[] words = StringUtils.splitPreserveAllTokens(text, " ");
		return words;
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

		double[] freq1 = getFrequency(allWords,words1);
		double[] freq2 = getFrequency(allWords,words2);

		double[] norm1 = normalize(freq1);
		double[] norm2 = normalize(freq2);
		
		return findDotProduct(norm1,norm2);
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
	
	public SentenceModel getSentenceModel(Locale locale) {
		File file = configurationService.getFile("WEB-INF","data","models",locale.getLanguage()+"-sent.bin");
		
		//File file = getTestFile("web/WEB-INF/data/models/en-sent.bin");
		InputStream modelIn = null;
		try {
			modelIn = new FileInputStream(file);
			return new SentenceModel(modelIn);
		} catch (FileNotFoundException e) {
		} catch (InvalidFormatException e) {
		} catch (IOException e) {
		} finally {
			IOUtils.closeQuietly(modelIn);
		}
		return null;
	}
	
	
	
	// Wiring...
	
	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
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
}
