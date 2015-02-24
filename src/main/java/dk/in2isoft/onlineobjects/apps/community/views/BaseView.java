package dk.in2isoft.onlineobjects.apps.community.views;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;

import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.services.ConfigurationService;

@ManagedBean(name = "base")
@RequestScoped
public class BaseView extends AbstractManagedBean {
	
	private ModelService modelService;
	private ConfigurationService configurationService;
	
	/*
	public List<Image> getImages() {
		int page = getRequest().getInt("page");
		Query<Image> query = Query.of(Image.class).orderByCreated().withPaging(page, 20);
		SearchResult<Image> search = modelService.search(query);
		return search.getResult();
	}
	
	public List<Pair<User, Person>> getUsers() {
		UserQuery q = new UserQuery();
		PairSearchResult<User, Person> users = modelService.searchPairs(q);
		return users.getResult();
	}*/
	
	public boolean isDevelopmentMode() {
		return configurationService.isDevelopmentMode();
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public ModelService getModelService() {
		return modelService;
	}

	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}

	public ConfigurationService getConfigurationService() {
		return configurationService;
	}

}
