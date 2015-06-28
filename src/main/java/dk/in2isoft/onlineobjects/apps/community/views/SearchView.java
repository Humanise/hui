package dk.in2isoft.onlineobjects.apps.community.views;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Property;

public class SearchView extends AbstractManagedBean implements InitializingBean {

	private ModelService modelService;
	private List<Image> images;
	private String text;
	
	public void afterPropertiesSet() throws Exception {
		this.text = getRequest().getString("text");
		Query<Image> query = Query.after(Image.class).withWords(this.text).withPrivileged(getRequest().getSession()).withPaging(0, 5);
		String tag = getRequest().getString("tag");
		if (StringUtils.isNotBlank(tag)) {
			query.withCustomProperty(Property.KEY_COMMON_TAG, tag );
		}
		SearchResult<Image> search = modelService.search(query);
		this.images = search.getList();
	}
	
	public String getText() {
		return text;
	}
	
	public List<Image> getImages() {
		return images;
	}
	

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
}
