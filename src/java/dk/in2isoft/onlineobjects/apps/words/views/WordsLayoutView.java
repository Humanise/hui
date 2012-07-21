package dk.in2isoft.onlineobjects.apps.words.views;

import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.commons.jsf.AbstractView;

public class WordsLayoutView extends AbstractView implements InitializingBean {

		
	public void afterPropertiesSet() throws Exception {
	}
	
	public boolean isLoggedIn() {
		return !isPublicUser();
	}

	public String getLanguage() {
		return getRequest().getLanguage();
	}
}
