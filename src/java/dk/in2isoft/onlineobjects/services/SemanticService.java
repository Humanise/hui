package dk.in2isoft.onlineobjects.services;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import dk.in2isoft.onlineobjects.util.semantics.Language;

public class SemanticService {
	private static Pattern pattern = Pattern.compile("[a-zA-Z]+");
	

	public String[] getWords(String text, Language language) {
		List<String> list = Lists.newArrayList();
		Matcher m = pattern.matcher(text);
		while (m.find()) {
			String word = m.group();
			if (language==null) {
				list.add(word);
			} else if (language.isWord(word) && !language.isCommonWord(word)) {
				word = language.stem(word);
				list.add(word);
			}
		}
		return list.toArray(new String[]{});
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

	public Map<String, Integer> getWordFrquency(String text,Language language) {
		Map<String,Integer> frequency = Maps.newHashMap();
		String[] words = getWords(text,language);
		for (String word : words) {
			if (frequency.containsKey(word)) {
				frequency.put(word, frequency.get(word)+1);
			} else {
				frequency.put(word, 1);
			}
		}
		return frequency;
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
}
