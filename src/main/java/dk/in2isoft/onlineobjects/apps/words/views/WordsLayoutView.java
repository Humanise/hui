package dk.in2isoft.onlineobjects.apps.words.views;

import java.util.List;
import java.util.Locale;

import javax.faces.model.SelectItem;

import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.onlineobjects.apps.words.views.util.WordsInterfaceHelper;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.jsf.model.Option;
import dk.in2isoft.onlineobjects.util.Messages;

public class WordsLayoutView extends AbstractView implements InitializingBean {

	private Messages msg;
	private WordsInterfaceHelper wordsInterfaceHelper;
	
	public void afterPropertiesSet() throws Exception {
		msg = new Messages(Language.class);
	}
	
	public boolean isFront() {
		return getRequest().getLocalPath().length < 2;
	}
	
	public String getSelectedMenuItem() {
		String[] path = getRequest().getLocalPath();
		if (path.length==0 || path.length==1) {
			return "front";
		}
		if (path.length>=2 && path[1].equals("search")) {
			return "search";
		}
		if (path.length>=2 && path[1].equals("statistics")) {
			return "statistics";
		}
		if (path.length>=2 && path[1].equals("index")) {
			return "index";
		}
		if (path.length>=2 && path[1].equals("about")) {
			return "about";
		}
		return null;
	}
	
	public List<SelectItem> getLanguages() {
		List<SelectItem> items = Lists.newArrayList();
		String[] languages = new String[] {"da","en"};
		Request request = getRequest();
		String[] path = request.getLocalPath();
		for (String language : languages) {
			StringBuilder sb = new StringBuilder();
			sb.append("/").append(language).append("/");
			for (int i = 1; i < path.length; i++) {
				String string = path[i];
				
				sb.append(string);
				if (!string.contains(".")) {
					sb.append("/");
				}
			}
			Option option = new Option(sb.toString(),msg.get("code."+language, new Locale(language)));
			option.setSelected(language.equals(request.getLanguage()));
			items.add(option);
		}
		return items;
	}
	
	public List<Option> getAlphabeth() {
		return wordsInterfaceHelper.getLetterOptions(getLocale());
	}
	
	public boolean isLoggedIn() {
		return !isPublicUser();
	}

	public String getLanguage() {
		return getRequest().getLanguage();
	}
	
	public void setWordsInterfaceHelper(WordsInterfaceHelper wordsInterfaceHelper) {
		this.wordsInterfaceHelper = wordsInterfaceHelper;
	}
}
