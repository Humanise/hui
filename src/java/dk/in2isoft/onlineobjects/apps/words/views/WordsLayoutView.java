package dk.in2isoft.onlineobjects.apps.words.views;

import java.util.List;

import javax.faces.model.SelectItem;

import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.jsf.model.Option;
import dk.in2isoft.onlineobjects.util.Messages;

public class WordsLayoutView extends AbstractView implements InitializingBean {

	private Messages msg;
		
	public void afterPropertiesSet() throws Exception {
		msg = new Messages("classpath:dk/in2isoft/onlineobjects/apps/words/msg/Words");
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
			Option option = new Option(sb.toString(),msg.get(language, request.getLocale()));
			option.setSelected(language.equals(request.getLanguage()));
			items.add(option);
		}
		return items;
	}
	
	public boolean isLoggedIn() {
		return !isPublicUser();
	}

	public String getLanguage() {
		return getRequest().getLanguage();
	}
}
