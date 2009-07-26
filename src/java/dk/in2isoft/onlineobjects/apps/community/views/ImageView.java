package dk.in2isoft.onlineobjects.apps.community.views;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Location;
import dk.in2isoft.onlineobjects.util.images.ImageInfo;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class ImageView extends AbstractManagedBean implements InitializingBean {

	private ModelService modelService;
	private SecurityService securityService;
	private ImageService imageService;
	private Image image;
	private ImageInfo imageInfo;
	private Location location;
	
	public void afterPropertiesSet() throws Exception {
		image = modelService.get(Image.class, getImageId());
		if (image!=null) {
			imageInfo = imageService.getImageInfo(image);
			location = modelService.getParent(image, Location.class);
		}
	}
	
	public Image getImage() {
		return image;
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
	
	public boolean getCanEdit() {
		return securityService.canModify(image, getRequest().getSession());
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
