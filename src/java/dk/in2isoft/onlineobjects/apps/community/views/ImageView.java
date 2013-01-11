package dk.in2isoft.onlineobjects.apps.community.views;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.PairSearchResult;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserQuery;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Location;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.util.images.ImageInfo;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class ImageView extends AbstractManagedBean implements InitializingBean {

	private ModelService modelService;
	private SecurityService securityService;
	private ImageService imageService;
	private Image image;
	private ImageInfo imageInfo;
	private Location location;
	private User user;
	private Person person;
	private boolean secret;
	private boolean canModify;
	
	public void afterPropertiesSet() throws Exception {
		UserSession privileged = getRequest().getSession();
		image = modelService.get(Image.class, getImageId(), privileged);
		if (image!=null) {
			if (!securityService.canView(image, getRequest().getSession())) {
				image = null;
				return;
			}
			canModify = securityService.canModify(image, getRequest().getSession());
			if (canModify) {
				secret = !securityService.canView(image, securityService.getPublicUser());
			}
			
			imageInfo = imageService.getImageInfo(image);
			location = modelService.getParent(image, Location.class);

			String username = getRequest().getLocalPath()[0];
			UserQuery query = new UserQuery().withUsername(username);
			PairSearchResult<User,Person> searchPairs = modelService.searchPairs(query);
			Pair<User,Person> first = searchPairs.getFirst();
			if (first!=null) {
				user = first.getKey();
				person = first.getValue();
			}
		}
	}
	
	public Person getPerson() {
		return person;
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
	
	public String getDescription() {
		return StringUtils.trim(imageInfo.getDescription());
	}
	
	public Location getLocation() {
		return location;
	}
	
	public double getMegaPixels() {
		return Math.round(image.getWidth()*image.getHeight()/(double)10000)/(double)100;
	}
	
	public Long getImageId() {
		String[] path = getRequest().getLocalPath();
		String string = path[path.length-1];
		String[] split = string.split("\\.");
		return Long.valueOf(split[0]);
	}
	
	public boolean isCanModify() {
		return canModify;
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public ModelService getModelService() {
		return modelService;
	}

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}

	public SecurityService getSecurityService() {
		return securityService;
	}

	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}

	public ImageService getImageService() {
		return imageService;
	}
}
