package dk.in2isoft.onlineobjects.apps.photos.views;

import java.util.List;

import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserQuery;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.WordCloudQuery;
import dk.in2isoft.onlineobjects.modules.photos.PhotoIndexQuery;
import dk.in2isoft.onlineobjects.modules.photos.PhotoService;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.ui.data.CloudItem;
import dk.in2isoft.onlineobjects.ui.jsf.ListModel;
import dk.in2isoft.onlineobjects.ui.jsf.ListModelResult;

public class PhotosUserView extends AbstractManagedBean implements InitializingBean {

	private ModelService modelService;
	private PhotoService photoService; 
	private SecurityService securityService;
	
	private String username;
	private User user;
	private Person person;
	private ListModel<Image> listModel;
	private String text;
	private Long wordId;
	private List<CloudItem<Word>> cloud;
	private String root;
	
	public void afterPropertiesSet() throws Exception {
		Request request = getRequest();
		String[] path = request.getLocalPath();
		username = path[2];
		UserQuery query = new UserQuery().withUsername(username);
		Pair<User, Person> pair = modelService.searchPairs(query).getFirst();
		if (pair == null) {
			throw new ContentNotFoundException("User not found");
		}
		root = request.getLocalPathAsString()+"/";
		
		this.user = pair.getKey();
		this.person = pair.getValue();
		text = request.getString("text");
		wordId = request.getLong("wordId", null);
		
		WordCloudQuery cloudQuery = new WordCloudQuery(user,Image.class);
		if (user.getIdentity()!=request.getSession().getIdentity()) {
			cloudQuery.withViewId(securityService.getPublicUser().getIdentity());
		}
		this.cloud = modelService.list(cloudQuery);
		int max = Integer.MIN_VALUE;
		int min = Integer.MAX_VALUE;
		for (CloudItem<Word> item : cloud) {
			max = Math.max(max, item.getCount());
			min = Math.min(min, item.getCount());
		}
		float span = max-min;
		for (CloudItem<Word> item : cloud) {
			float fromMin = (item.getCount()-min);
			float fraction = fromMin / span;
			item.setFraction(fraction);
			item.setLevel(Math.round(fraction * 10f));
		}
	}
	
	public String getUsername() {
		return username;
	}
	
	public String getPersonName() {
		return person.getFullName();
	}
	
	public List<CloudItem<Word>> getCloud() {
		return cloud;
	}
	
	public String getText() {
		return text;
	}
	
	public String getRoot() {
		return root;
	}
	
	public ListModel<Image> getImageList() {
		if (listModel!=null) return listModel;
		ListModel<Image> model = new ListModel<Image>() {

			@Override
			public ListModelResult<Image> getResult() {
				PhotoIndexQuery query = new PhotoIndexQuery().withPage(getPage()).withPageSize(getPageSize()).withOwner(user).withViewer(getRequest().getSession());
				query.withText(text);
				if (wordId!=null) {
					query.withWordId(wordId);
				}
				SearchResult<Image> searchResult = photoService.search(query);
				return new ListModelResult<Image>(searchResult.getList(),searchResult.getTotalCount());
			}
			
		};
		model.setPageSize(42);
		listModel = model;
		return model;
	}
	
	// Wiring...

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setPhotoService(PhotoService photoService) {
		this.photoService = photoService;
	}
	
	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
}
