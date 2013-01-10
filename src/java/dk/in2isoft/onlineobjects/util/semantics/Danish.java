package dk.in2isoft.onlineobjects.util.semantics;

import java.util.ArrayList;

import org.apache.commons.lang.math.NumberUtils;

import com.google.common.collect.Lists;

public class Danish extends Language {

	private EnglishPorterStemmer stemmer;
	private ArrayList<String> stopWords;

	public Danish() {
		super();
		stopWords = Lists.newArrayList("og","i","jeg","det","at","en","den","til","er","som","på","de","med","han","af","for","ikke","der","var","mig","sig","men","et","har","om","vi","min","havde","ham","hun","nu","over","da","fra","du","ud","sin","dem","os","op","man","hans","hvor","eller","hvad","skal","selv","her","alle","vil","blev","kunne","ind","når","være","dog","noget","ville","jo","deres","efter","ned","skulle","denne","end","dette","mit","også","under","have","dig","anden","hende","mine","alt","meget","sit","sine","vor","mod","disse","hvis","din","nogle","hos","blive","mange","ad","bliver","hendes","været","thi","jer","sådan","kan","ved","siger","flere","mere","går","kl","så");
		this.stemmer = new EnglishPorterStemmer();
	}

	@Override
	public boolean isWord(String word) {
		return !NumberUtils.isNumber(word);
	}
	
	@Override
	public String stem(String word) {
		return stemmer.stem(word);
	}
	
	@Override
	public boolean isCommonWord(String word) {
		return stopWords.contains(word) || word.length()<2;
	}
}
