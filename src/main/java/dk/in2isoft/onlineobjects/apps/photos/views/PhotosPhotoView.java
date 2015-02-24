package dk.in2isoft.onlineobjects.apps.photos.views;

import java.util.List;
import java.util.Locale;

import javax.faces.model.SelectItem;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Files;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.apps.photos.PhotosController;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.PairSearchResult;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserQuery;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.ImageGallery;
import dk.in2isoft.onlineobjects.model.Location;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.services.PersonService;
import dk.in2isoft.onlineobjects.ui.jsf.model.MapPoint;
import dk.in2isoft.onlineobjects.util.Dates;
import dk.in2isoft.onlineobjects.util.Messages;
import dk.in2isoft.onlineobjects.util.images.ImageInfo;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class PhotosPhotoView extends AbstractManagedBean implements InitializingBean {

	private ModelService modelService;
	private SecurityService securityService;
	private ImageService imageService;
	private PersonService personService;
	
	private String language;
	private Image image;
	private ImageInfo imageInfo;
	private Location location;
	private MapPoint mapPoint;
	private User user;
	private Person person;
	private Image personImage;
	private boolean secret;
	private boolean canModify;
	private List<SelectItem> properties;
	private long nextId;
	private long previousId;
	private List<Pair<Word,String>> words;
	private boolean vertical;
	private List<ImageGallery> galleries;
	
	private String fullPersonName;
	
	public void afterPropertiesSet() throws Exception {
		UserSession session = getRequest().getSession();
		image = modelService.get(Image.class, getImageId(), session);
		if (image!=null) {
			Messages msg = new Messages(PhotosController.class);
			
			if (!securityService.canView(image, session)) {
				image = null;
				return;
			}
			vertical = ((float)image.getHeight())/((float)image.getWidth()) > 0.8;
			
			canModify = securityService.canModify(image, session);
			if (canModify) {
				secret = !securityService.canView(image, securityService.getPublicUser());
			}
			
			imageInfo = imageService.getImageInfo(image);
			
			if (imageInfo.getRotation()!=null && (Math.abs(imageInfo.getRotation())==90)) {
				vertical=!vertical;
			}
			
			location = modelService.getParent(image, Location.class);

			user = modelService.getOwner(image);
			if (user!=null) {
				UserQuery query = new UserQuery().withUsername(user.getUsername());
				PairSearchResult<User,Person> searchPairs = modelService.searchPairs(query);
				Pair<User,Person> first = searchPairs.getFirst();
				if (first!=null) {
					user = first.getKey();
					person = first.getValue();
					personImage = modelService.getChild(user, Relation.KIND_SYSTEM_USER_IMAGE, Image.class);
					fullPersonName = personService.getFullPersonName(person, 14);
				}
			}
			
			Query<Image> allQuery = Query.after(Image.class).withPrivileged(user).orderByCreated();
			if (user==null || user.getId()!=session.getIdentity()) {
				allQuery.withPublicView();
			}
			List<Long> ids = modelService.listIds(allQuery);
			int position = ids.indexOf(image.getId());
			int previous = position>0 ? position-1 : ids.size()-1;
			int next = position<ids.size()-1 ? position+1 : 0;
			nextId = ids.get(next);
			previousId = ids.get(previous);
			
			Locale locale = getRequest().getLocale();
			properties = Lists.newArrayList();
			properties.add(new SelectItem(image.getWidth()+" x "+image.getHeight()+" - "+getMegaPixels()+" Megapixel",msg.get("size", locale)));
			properties.add(new SelectItem(Files.formatFileSize(image.getFileSize())+", "+image.getContentType(),msg.get("file", locale)));
			properties.add(new SelectItem(Dates.formatLongDate(image.getCreated(),locale ),msg.get("added", locale)));
			if (imageInfo.getTaken()!=null) {
				properties.add(new SelectItem(Dates.formatLongDate(imageInfo.getTaken(),locale ),msg.get("date", locale)));
			}
			if (Strings.isNotBlank(imageInfo.getCameraMake())) {
				//properties.add(new SelectItem(imageInfo.getCameraMake(),"Camera manufacturer"));
			}
			if (Strings.isNotBlank(imageInfo.getCameraModel())) {
				properties.add(new SelectItem(imageInfo.getCameraModel(),"Camera"));
			}
			if (imageInfo.getRotation()!=null) {
				properties.add(new SelectItem(imageInfo.getRotation(),"Rotation"));
			}
			if (location!=null) {
				mapPoint = new MapPoint();
				mapPoint.setTitle(location.getName());
				mapPoint.setLatitude(location.getLatitude());
				mapPoint.setLongitude(location.getLongitude());
			}
			List<Word> wordChildren = modelService.getChildren(image, null, Word.class);
			words = Lists.newArrayList();
			for (Word word : wordChildren) {
				String link = "";
				if (user!=null) {
					link = "/"+locale.getLanguage()+"/users/"+user.getUsername()+"/?wordId="+word.getId();
				}
				words.add(Pair.of(word, link));
			}

			String[] path = getRequest().getLocalPath();
			language = path[0];
			
			galleries = modelService.getParents(image, ImageGallery.class,session);
		}
	}
	
	public List<SelectItem> getProperties() {
		return properties;
	}
	
	public List<ImageGallery> getGalleries() {
		return galleries;
	}
	
	public Person getPerson() {
		return person;
	}
	
	public String getFullPersonName() {
		return fullPersonName;
	}
	
	public User getUser() {
		return user;
	}
	
	public Image getImage() {
		return image;
	}
	
	public boolean isSecret() {
		return secret;
	}
	
	public ImageInfo getImageInfo() {
		return imageInfo;
	}
	
	public long getNextId() {
		return nextId;
	}
	
	public long getPreviousId() {
		return previousId;
	}
	
	public String getTitle() {
		if (Strings.isBlank(image.getName())) {
			return "No title";
		}
		return image.getName();
	}
	
	public String getDescription() {
		return StringUtils.trim(imageInfo.getDescription());
	}
	
	public Location getLocation() {
		return location;
	}
	
	public MapPoint getMapPoint() {
		return mapPoint;
	}
	
	public double getMegaPixels() {
		return Math.round(image.getWidth()*image.getHeight()/(double)10000)/(double)100;
	}
	
	public List<Pair<Word, String>> getWords() {
		return words;
	}
	
	public Image getPersonImage() {
		return personImage;
	}
	
	public Long getImageId() {
		String[] path = getRequest().getLocalPath();
		String string = path[path.length-1];
		String[] split = string.split("\\.");
		return Long.valueOf(split[0]);
	}
	
	public String getLanguage() {
		return language;
	}
	
	public boolean isCanModify() {
		return canModify;
	}
	
	public boolean isVertical() {
		return vertical;
	}
	
	// Wiring...

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}

	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}
	
	public void setPersonService(PersonService personService) {
		this.personService = personService;
	}
}
