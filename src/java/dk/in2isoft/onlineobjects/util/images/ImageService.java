package dk.in2isoft.onlineobjects.util.images;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.drew.imaging.jpeg.JpegMetadataReader;
import com.drew.imaging.jpeg.JpegProcessingException;
import com.drew.lang.Rational;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.MetadataException;
import com.drew.metadata.Tag;
import com.drew.metadata.exif.ExifIFD0Directory;
import com.drew.metadata.exif.GpsDirectory;
import com.drew.metadata.iptc.IptcDirectory;

import dk.in2isoft.commons.geo.GeoDistance;
import dk.in2isoft.commons.util.AbstractCommandLineInterface;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Location;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.FileService;
import dk.in2isoft.onlineobjects.services.StorageService;
import dk.in2isoft.onlineobjects.util.images.ImageInfo.ImageLocation;

public class ImageService extends AbstractCommandLineInterface {

	private static Logger log = Logger.getLogger(ImageService.class);
	
	private StorageService storageService;
	private ConfigurationService configurationService;
	private FileService fileService;
	private ModelService modelService;

	public ImageService() {
	}
	
	public File getThumbnail(long id, int size) throws EndUserException {
		return getThumbnail(id, size, size);
	}

	public File getThumbnail(long id, int width, int height) throws EndUserException {
		File folder = storageService.getItemFolder(id);
		File original = new File(folder, "original");
		if (!original.isFile()) {
			throw new EndUserException("The image with id=" + id + " does not exist");
		}
		File converted = new File(folder, "thumbnail-" + width + "x" + height + ".jpg");
		if (!converted.exists()) {
			String cmd = getImageMagickCommand()+" -thumbnail " + width
					+ "x" + height + " " + original.getAbsolutePath() + "[0] " + converted.getAbsolutePath();
			execute(cmd);
		}
		return converted;
	}

	public File getCroppedThumbnail(long id, int width, int height) throws EndUserException {
		File folder = storageService.getItemFolder(id);
		File original = new File(folder, "original");
		if (!original.isFile()) {
			throw new EndUserException("The image with id=" + id + " does not exist");
		}
		File converted = new File(folder, "thumbnail-" + width + "x" + height + "cropped.jpg");
		if (!converted.exists()) {
			String cmd = getImageMagickCommand()+" -size " + (width * 3)
					+ "x" + (height * 3) + " " + original.getAbsolutePath() + " -thumbnail x" + (height * 2)
					+ "   -resize " + (width * 2) + "x<   -resize 50% -gravity center -crop " + width + "x" + height
					+ "+0+0  +repage " + converted.getAbsolutePath();
			execute(cmd);
		}
		return converted;
	}
	
	private String getImageMagickCommand() {
		return configurationService.getImageMagickPath() + "/convert"; // -limit area 100mb
	}

	public int[] getImageDimensions(File file) throws EndUserException {
		int[] dimensions = new int[] { 0, 0 };
		log.debug(file.getAbsolutePath());
		log.debug("Exists: " + file.exists());
		String cmd = configurationService.getImageMagickPath() + "/identify -quiet -format \"%wx%h\" "
				+ file.getAbsolutePath() + "[0]";
		String result = execute(cmd).trim();
		Pattern pattern = Pattern.compile(".*\"([0-9]+)x([0-9]+)\"");
		Matcher matcher = pattern.matcher(result);
		if (matcher.matches()) {
			dimensions[0] = Integer.parseInt(matcher.group(1));
			dimensions[1] = Integer.parseInt(matcher.group(2));
		} else {
			throw new EndUserException("Could not parse output: " + result);
		}
		return dimensions;
	}
	
	public ImageMetaData getMetaData(File file) {
		ImageMetaData imageMetaData = new ImageMetaData();
		try {
			Metadata metadata;
			metadata = JpegMetadataReader.readMetadata(file);
			Directory exifDirectory = metadata.getDirectory(ExifIFD0Directory.class);
			Directory gpsDirectory = metadata.getDirectory(GpsDirectory.class);
			Directory iptcDirectory = metadata.getDirectory(IptcDirectory.class);
			
			Iterable<Directory> directories = metadata.getDirectories();
			for (Directory dir : directories) {
				Collection<Tag> tags = dir.getTags();
				for (Tag tag : tags) {
					if (dir.containsTag(tag.getTagType())) {
						log.info(dir.getName()+" : "+tag.getTagName()+" : "+dir.getObject(tag.getTagType()));
					}
				}
			}
			
			//if (exifDirectory.containsTag(ExifIFD0Directory.TAG_DATETIME_ORIGINAL)) {
			//	imageMetaData.setDateTimeOriginal(exifDirectory.getDate(ExifDirectory.TAG_DATETIME_ORIGINAL));
			//}
			if (exifDirectory.containsTag(ExifIFD0Directory.TAG_DATETIME)) {
				imageMetaData.setDateTime(exifDirectory.getDate(ExifIFD0Directory.TAG_DATETIME));
			}
			if (exifDirectory.containsTag(ExifIFD0Directory.TAG_MAKE)) {
				imageMetaData.setCameraMake(exifDirectory.getString(ExifIFD0Directory.TAG_MAKE));
			}
			if (exifDirectory.containsTag(ExifIFD0Directory.TAG_MODEL)) {
				imageMetaData.setCameraModel(exifDirectory.getString(ExifIFD0Directory.TAG_MODEL));
			}
			if (iptcDirectory.containsTag(IptcDirectory.TAG_OBJECT_NAME)) {
				imageMetaData.setObjectName(iptcDirectory.getString(IptcDirectory.TAG_OBJECT_NAME));
			}
			if (iptcDirectory.containsTag(IptcDirectory.TAG_CAPTION)) {
				imageMetaData.setCaption(iptcDirectory.getString(IptcDirectory.TAG_CAPTION));
			}
			if (iptcDirectory.containsTag(IptcDirectory.TAG_KEYWORDS)) {
				imageMetaData.setKeywords(iptcDirectory.getStringArray(IptcDirectory.TAG_KEYWORDS));
			}
			if (gpsDirectory.containsTag(GpsDirectory.TAG_GPS_LATITUDE) && gpsDirectory.containsTag(GpsDirectory.TAG_GPS_LATITUDE_REF)) {
				String ref = gpsDirectory.getString(GpsDirectory.TAG_GPS_LATITUDE_REF);
				Rational[] dist = gpsDirectory.getRationalArray(GpsDirectory.TAG_GPS_LATITUDE);
				double decimal = getDecimal(dist,ref);
				imageMetaData.setLatitude(decimal);
			}
			if (gpsDirectory.containsTag(GpsDirectory.TAG_GPS_LONGITUDE) && gpsDirectory.containsTag(GpsDirectory.TAG_GPS_LONGITUDE_REF)) {
				String ref = gpsDirectory.getString(GpsDirectory.TAG_GPS_LONGITUDE_REF);
				Rational[] dist = gpsDirectory.getRationalArray(GpsDirectory.TAG_GPS_LONGITUDE);
				double decimal = getDecimal(dist,ref);
				imageMetaData.setLongitude(decimal);
			}
			
			Collection<Tag> tags = gpsDirectory.getTags();
			for (Tag tag : tags) {
				if (gpsDirectory.containsTag(tag.getTagType())) {
					Object object = gpsDirectory.getObject(tag.getTagType());
					if (object instanceof Rational[]) {
						Rational[] pos = (Rational[]) object;
						GeoDistance convert = new GeoDistance(pos[0].longValue(), pos[1].longValue(), pos[2].longValue());
						log.info(tag.getTagName()+" != "+convert.getDecimal());
					} else {
						log.info(tag.getTagName()+" = "+object);
					}
				}
			}
		} catch (JpegProcessingException e) {
			log.error(e.getMessage(), e);
		} catch (IOException e) {
			log.error(e.getMessage(), e);
		}
		return imageMetaData;
	}
	
	private double getDecimal(Rational[] triple, String ref) {
		GeoDistance point = new GeoDistance(triple[0].doubleValue(),triple[1].doubleValue(),triple[2].doubleValue());
		double decimal = point.getDecimal();
		if (ref.equals("S") || ref.equals("W")) {
			decimal*=-1;
		}
		
		return decimal;
	}
	
	public void synchronizeContentType(Image image, Privileged priviledged) throws EndUserException {
		File file = getImageFile(image);
		String mimeType = fileService.getMimeType(file);
		if (!StringUtils.equals(mimeType, image.getContentType())) {
			image.setContentType(mimeType);
			modelService.updateItem(image, priviledged);
		}
	}
	
	public void synchronizeMetaData(Image image, Privileged priviledged) throws EndUserException {
		File file = getImageFile(image);
		ImageMetaData metaData = getMetaData(file);
		boolean modified = false;
		Date taken = image.getPropertyDateValue(Property.KEY_PHOTO_TAKEN);
		if (taken==null) {
			image.overrideFirstProperty(Property.KEY_PHOTO_TAKEN, metaData.getDateTimeOriginal());
			modified = true;
		}
		String make = image.getPropertyValue(Property.KEY_PHOTO_CAMERA_MAKE);
		if (make==null) {
			image.overrideFirstProperty(Property.KEY_PHOTO_CAMERA_MAKE, metaData.getCameraMake());
			modified = true;
		}
		String model = image.getPropertyValue(Property.KEY_PHOTO_CAMERA_MODEL);
		if (model==null) {
			image.overrideFirstProperty(Property.KEY_PHOTO_CAMERA_MODEL, metaData.getCameraModel());
			modified = true;
		}
		if (!ArrayUtils.isEmpty(metaData.getKeywords())) {
			image.overrideProperties(Property.KEY_COMMON_TAG, Arrays.asList(metaData.getKeywords()));
		}
		if (metaData.getObjectName()!=null) {
			image.setName(metaData.getObjectName());
			modified = true;
		}
		if (metaData.getCaption()!=null) {
			image.overrideFirstProperty(Image.PROPERTY_DESCRIPTION, metaData.getCaption());
			modified = true;
		}
		if (modified) {
			modelService.updateItem(image, priviledged);
		}
		if (metaData.getLatitude()!=null && metaData.getLongitude()!=null) {
			Location location = modelService.getParent(image, Location.class);
			if (location==null) {
				location = new Location();
				location.setLatitude(metaData.getLatitude());
				location.setLongitude(metaData.getLongitude());
				modelService.createItem(location, priviledged);
				modelService.createRelation(location, image, null, priviledged);
			}
		}
	}

	public ImageInfo getImageInfo(Image image) throws ModelException {
		ImageInfo info = new ImageInfo();
		info.setId(image.getId());
		info.setName(image.getName());
		info.setTaken(image.getPropertyDateValue(Property.KEY_PHOTO_TAKEN));
		info.setDescription(image.getPropertyValue(Image.PROPERTY_DESCRIPTION));
		info.setCameraMake(image.getPropertyValue(Property.KEY_PHOTO_CAMERA_MAKE));
		info.setCameraModel(image.getPropertyValue(Property.KEY_PHOTO_CAMERA_MODEL));
		info.setTags(image.getPropertyValues(Property.KEY_COMMON_TAG));
		Location location = modelService.getParent(image, Location.class);
		if (location!=null) {
			info.setLocation(new ImageLocation(location.getLatitude(), location.getLongitude()));
		}
		return info;
	}
	
	public void updateImageInfo(ImageInfo info, Privileged priviledged) throws ModelException, SecurityException {

		Image image = modelService.get(Image.class, info.getId(),priviledged);
		image.setName(info.getName());
		image.overrideFirstProperty(Image.PROPERTY_DESCRIPTION, info.getDescription());
		image.overrideFirstProperty(Property.KEY_PHOTO_TAKEN, info.getTaken());
		image.overrideProperties(Property.KEY_COMMON_TAG, info.getTags());
		modelService.updateItem(image, priviledged);
		Location location = modelService.getParent(image, Location.class);
		if (info.getLocation()==null) {
			if (location!=null) {
				modelService.deleteEntity(location, priviledged);
			}
			return;
		}
		if (info.getLocation()==null && location!=null) {
			modelService.deleteEntity(location, priviledged);
		} else if (info.getLocation()!=null && location==null) {
			location = new Location();
			location.setLatitude(info.getLocation().getLatitude());
			location.setLongitude(info.getLocation().getLongitude());
			modelService.createItem(location, priviledged);
			modelService.createRelation(location, image, priviledged);
		} else {
			location.setLatitude(info.getLocation().getLatitude());
			location.setLongitude(info.getLocation().getLongitude());			
			modelService.updateItem(location, priviledged);
		}
	}
	
	public void updateImageLocation(Image image, ImageLocation imageLocation, Privileged priviledged) throws ModelException, SecurityException {
		Location existing = modelService.getParent(image, Location.class);
		if (imageLocation==null && existing==null) {
			return;
		}
		else if (imageLocation==null && existing!=null) {
			// Delete
			modelService.deleteEntity(existing, priviledged);
		} else if (imageLocation!=null && existing==null) {
			// Update
			existing = new Location();
			existing.setLatitude(imageLocation.getLatitude());
			existing.setLongitude(imageLocation.getLongitude());
			modelService.createItem(existing, priviledged);
			modelService.createRelation(existing, image, priviledged);
		} else {
			// Add
			existing.setLatitude(imageLocation.getLatitude());
			existing.setLongitude(imageLocation.getLongitude());			
			modelService.updateItem(existing, priviledged);
		}		
	}

	public void setStorageService(StorageService storageService) {
		this.storageService = storageService;
	}

	public StorageService getStorageService() {
		return storageService;
	}

	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}

	public ConfigurationService getConfigurationService() {
		return configurationService;
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public ModelService getModelService() {
		return modelService;
	}

	public void setFileService(FileService fileService) {
		this.fileService = fileService;
	}

	public FileService getFileService() {
		return fileService;
	}

	public File getImageFile(Image image) {
		File folder = storageService.getItemFolder(image);
		return new File(folder,"original");
	}

	public void changeImageFile(Image image, File file,String contentType)
	throws EndUserException {
		int[] dimensions = getImageDimensions(file);
		image.setWidth(dimensions[0]);
		image.setHeight(dimensions[1]);
		image.setContentType(contentType);
		image.setFileSize(file.length());
		File folder = storageService.getItemFolder(image);
		file.renameTo(new File(folder,"original"));
	}
}
