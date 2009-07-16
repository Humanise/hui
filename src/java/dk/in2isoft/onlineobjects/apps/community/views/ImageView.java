package dk.in2isoft.onlineobjects.apps.community.views;

import java.util.Date;

import org.springframework.beans.factory.InitializingBean;

import com.drew.imaging.jpeg.JpegMetadataReader;
import com.drew.imaging.jpeg.JpegProcessingException;
import com.drew.lang.CompoundException;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.exif.ExifDirectory;

import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.model.Image;

public class ImageView extends AbstractManagedBean implements InitializingBean {

	private ModelService modelService;
	private SecurityService securityService;
	Image image;
	
	public void afterPropertiesSet() throws Exception {
		image = modelService.get(Image.class, getImageId());
	}
	
	public Image getImage() {
		return image;
	}
	
	public Long getImageId() {
		String[] path = getRequest().getLocalPath();
		String string = path[path.length-1];
		String[] split = string.split("\\.");
		return Long.valueOf(split[0]);
	}
	
	public Date getTaken() throws Exception {
		Metadata metadata = JpegMetadataReader.readMetadata(image.getImageFile());
		Directory exifDirectory = metadata.getDirectory(ExifDirectory.class);
		if (exifDirectory.containsTag(ExifDirectory.TAG_DATETIME_ORIGINAL)) {
			return exifDirectory.getDate(ExifDirectory.TAG_DATETIME_ORIGINAL);
		}
		return null;
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
}
