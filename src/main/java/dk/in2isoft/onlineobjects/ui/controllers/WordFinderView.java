package dk.in2isoft.onlineobjects.ui.controllers;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.events.AnyModelChangeListener;
import dk.in2isoft.onlineobjects.core.events.EventService;
import dk.in2isoft.onlineobjects.model.Item;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.ui.jsf.model.Option;
import dk.in2isoft.onlineobjects.util.Messages;

public class WordFinderView extends AbstractView implements InitializingBean {

	private ModelService modelService;
	private EventService eventService;
	
	private Map<String,List<Option>> categories;
	private Map<String,List<Option>> languages;

	public WordFinderView() {
		categories = new ConcurrentHashMap<String, List<Option>>();		
		languages = new ConcurrentHashMap<String, List<Option>>();
	}
	

	@Override
	public void afterPropertiesSet() throws Exception {
		eventService.addModelEventListener(new AnyModelChangeListener() {
			@Override
			public void itemWasChanged(Item item) {
				categories.clear();
				languages.clear();
			}
		}.addType(Word.class).addType(LexicalCategory.class));
	}
	
	public List<Option> getCategories() {
		Locale locale = getLocale();
		String language = locale.getLanguage();
		if (categories.containsKey(language)) {
			return categories.get(language);
		}

		Messages msg = new Messages(LexicalCategory.class);
		List<Option> options = Lists.newArrayList();

		Option unknown = new Option();
		unknown.setLabel(msg.get("code","none", locale));
		options.add(unknown);

		Query<LexicalCategory> query = Query.of(LexicalCategory.class).orderByName();
		List<LexicalCategory> list = modelService.list(query);
		for (LexicalCategory category : list) {
			Option option = new Option();
			option.setValue(category.getCode());
			option.setLabel(msg.get("code",category.getCode(), locale));
			option.setDescription(msg.get("code",category.getCode()+"_description", locale));
			options.add(option);
		}
		categories.put(language, options);
		return options;
	}
	
	public List<Option> getLanguages() {
		Locale locale = getLocale();
		String language = locale.getLanguage();
		if (languages.containsKey(language)) {
			return languages.get(language);
		}

		Messages msg = new Messages(Language.class);
		List<Option> options = Lists.newArrayList();
		Query<Language> query = Query.of(Language.class).orderByName();
		List<Language> list = modelService.list(query);
		for (Language category : list) {
			Option option = new Option();
			option.setValue(category.getCode());
			option.setLabel(msg.get("code",category.getCode(), locale));
			options.add(option);
		}
		languages.put(language, options);
		return options;
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setEventService(EventService eventService) {
		this.eventService = eventService;
	}
}
