package dk.in2isoft.onlineobjects.apps.photos.views;

import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

import javax.faces.model.SelectItem;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Files;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.core.PairSearchResult;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.UserQuery;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Location;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.util.Dates;
import dk.in2isoft.onlineobjects.util.images.ImageInfo;
import dk.in2isoft.onlineobjects.util.images.ImageService;
import freemarker.template.SimpleNumber;

public class PhotosPhotoView extends AbstractManagedBean implements InitializingBean {

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
	private List<SelectItem> properties;
	private long nextId;
	private long previousId;
	
	public void afterPropertiesSet() throws Exception {
		image = modelService.get(Image.class, getImageId());
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

			user = modelService.getOwner(image);
			UserQuery query = new UserQuery().withUsername(user.getUsername());
			PairSearchResult<User,Person> searchPairs = modelService.searchPairs(query);
			Pair<User,Person> first = searchPairs.getFirst();
			if (first!=null) {
				user = first.getKey();
				person = first.getValue();
			}
			
			Query<Image> allQuery = Query.after(Image.class).withPrivileged(user).withPublicView().orderByCreated();
			List<Long> ids = modelService.listIds(allQuery);
			int position = ids.indexOf(image.getId());
			int previous = position>0 ? position-1 : ids.size()-1;
			int next = position<ids.size()-1 ? position+1 : 0;
			nextId = ids.get(next);
			previousId = ids.get(previous);
			
			Locale locale = getRequest().getLocale();
			properties = Lists.newArrayList();
			properties.add(new SelectItem(image.getWidth()+" x "+image.getHeight()+" - "+getMegaPixels()+" Megapixel","Size"));
			properties.add(new SelectItem(Files.formatFileSize(image.getFileSize())+", "+image.getContentType(),"File"));
			if (imageInfo.getTaken()!=null) {
				properties.add(new SelectItem(Dates.formatLongDate(imageInfo.getTaken(),locale ),"Date"));
			}
			if (Strings.isNotBlank(imageInfo.getCameraMake())) {
				//properties.add(new SelectItem(imageInfo.getCameraMake(),"Camera manufacturer"));
			}
			if (Strings.isNotBlank(imageInfo.getCameraModel())) {
				properties.add(new SelectItem(imageInfo.getCameraModel(),"Camera"));
			}
			if (location!=null) {
				DecimalFormat format = new DecimalFormat();
				format.setMinimumFractionDigits(0);
				format.setMaximumFractionDigits(2);
				{
					StringBuilder latitude = new StringBuilder();
					latitude.append(format.format(location.getLatitudeDegrees()));
					latitude.append(Strings.DEGREE).append(" ");
					latitude.append(format.format(location.getLatitudeMinutes()));
					latitude.append(Strings.RIGHT_SINGLE_QUOTE).append(" ");
					latitude.append(format.format(location.getLatitudeSeconds()));
					latitude.append(Strings.DOUBLE_APOSTROPHE);
					latitude.append(location.isLatitudeNorth() ? " North" : " South");
					properties.add(new SelectItem(latitude.toString(), "Latitude"));
				}
				{
					StringBuilder longitude = new StringBuilder();
					longitude.append(format.format(location.getLongitudeDegrees()));
					longitude.append(Strings.DEGREE).append(" ");
					longitude.append(format.format(location.getLongitudeMinutes()));
					longitude.append(Strings.RIGHT_SINGLE_QUOTE).append(" ");
					longitude.append(format.format(location.getLongitudeSeconds()));
					longitude.append(Strings.DOUBLE_APOSTROPHE);
					longitude.append(location.isLongitudeEast() ? " East" : " West");
					properties.add(new SelectItem(longitude.toString(), "Longitude"));
				}
			}
		}
	}
	
	public List<SelectItem> getProperties() {
		return properties;
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
	
	public long getNextId() {
		return nextId;
	}
	
	public long getPreviousId() {
		return previousId;
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
