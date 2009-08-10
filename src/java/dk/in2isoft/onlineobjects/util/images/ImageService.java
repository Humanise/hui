package dk.in2isoft.onlineobjects.util.images;

import java.io.File;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
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
import com.drew.metadata.exif.ExifDirectory;
import com.drew.metadata.exif.GpsDirectory;
import com.drew.metadata.iptc.IptcDirectory;

import dk.in2isoft.commons.geo.GeoLatLng;
import dk.in2isoft.commons.util.AbstractCommandLineInterfaceUtil;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Priviledged;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.Location;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.FileService;
import dk.in2isoft.onlineobjects.services.StorageService;
import eu.medsea.mimeutil.MimeType;
import eu.medsea.mimeutil.MimeUtil2;

public class ImageService extends AbstractCommandLineInterfaceUtil {

	private static Logger log = Logger.getLogger(ImageService.class);
	
	private StorageService storageService;
	private ConfigurationService configurationService;
	private FileService fileService;
	private ModelService modelService;
	private MimeUtil2 mimeUtil;

	public ImageService() {
		mimeUtil = new MimeUtil2();
		mimeUtil.registerMimeDetector("eu.medsea.mimeutil.detector.ExtensionMimeDetector");
		mimeUtil.registerMimeDetector("eu.medsea.mimeutil.detector.MagicMimeMimeDetector");
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
			String cmd = configurationService.getImageMagickPath() + "/convert -thumbnail " + width
					+ "x" + height + " " + original.getAbsolutePath() + "[0] " + converted.getAbsolutePath();
			execute(cmd);
		}
		return converted;
	}

	public File getCroppedThumbnail(long id, int width, int height) throws EndUserException {
		File folder = Core.getInstance().getStorageService().getItemFolder(id);
		File original = new File(folder, "original");
		if (!original.isFile()) {
			throw new EndUserException("The image with id=" + id + " does not exist");
		}
		File converted = new File(folder, "thumbnail-" + width + "x" + height + "cropped.jpg");
		if (!converted.exists()) {
			String cmd = configurationService.getImageMagickPath() + "/convert -size " + (width * 3)
					+ "x" + (height * 3) + " " + original.getAbsolutePath() + " -thumbnail x" + (height * 2)
					+ "   -resize " + (width * 2) + "x<   -resize 50% -gravity center -crop " + width + "x" + height
					+ "+0+0  +repage " + converted.getAbsolutePath();
			execute(cmd);
		}
		return converted;
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
			Directory exifDirectory = metadata.getDirectory(ExifDirectory.class);
			Directory gpsDirectory = metadata.getDirectory(GpsDirectory.class);
			Directory iptcDirectory = metadata.getDirectory(IptcDirectory.class);
			
			for (Iterator<Directory> iterator = metadata.getDirectoryIterator(); iterator.hasNext();) {
				Directory dir = iterator.next();
				for (Iterator<Tag> i = dir.getTagIterator(); i.hasNext();) {
					Tag tag = i.next();
					if (dir.containsTag(tag.getTagType())) {
						log.info(dir.getName()+" : "+tag.getTagName()+" : "+dir.getObject(tag.getTagType()));
					}
				}
			}
			
			if (exifDirectory.containsTag(ExifDirectory.TAG_DATETIME_ORIGINAL)) {
				imageMetaData.setDateTimeOriginal(exifDirectory.getDate(ExifDirectory.TAG_DATETIME_ORIGINAL));
			}
			if (exifDirectory.containsTag(ExifDirectory.TAG_DATETIME)) {
				imageMetaData.setDateTime(exifDirectory.getDate(ExifDirectory.TAG_DATETIME));
			}
			if (exifDirectory.containsTag(ExifDirectory.TAG_MAKE)) {
				imageMetaData.setCameraMake(exifDirectory.getString(ExifDirectory.TAG_MAKE));
			}
			if (exifDirectory.containsTag(ExifDirectory.TAG_MODEL)) {
				imageMetaData.setCameraModel(exifDirectory.getString(ExifDirectory.TAG_MODEL));
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
			
			for (Iterator<Tag> tagIterator = gpsDirectory.getTagIterator(); tagIterator.hasNext();) {
				Tag tag = tagIterator.next();
				if (gpsDirectory.containsTag(tag.getTagType())) {
					Object object = gpsDirectory.getObject(tag.getTagType());
					if (object instanceof Rational[]) {
						Rational[] pos = (Rational[]) object;
						GeoLatLng convert = new GeoLatLng(pos[0].longValue(), pos[1].longValue(), pos[2].longValue());
						log.info(tag.getTagName()+" != "+convert.getDecimal());
					} else {
						log.info(tag.getTagName()+" = "+object);
					}
				}
			}
		} catch (JpegProcessingException e) {
			log.error(e.getMessage(), e);
		} catch (MetadataException e) {
			log.error(e.getMessage(), e);
		}
		return imageMetaData;
	}
	
	private double getDecimal(Rational[] triple, String ref) {
		GeoLatLng point = new GeoLatLng(triple[0].doubleValue(),triple[1].doubleValue(),triple[2].doubleValue());
		double decimal = point.getDecimal();
		if (ref.equals("S") || ref.equals("W")) {
			decimal*=-1;
		}
		
		return decimal;
	}
	
	public void synchronizeContentType(Image image, Priviledged priviledged) throws EndUserException {
		String mimeType = fileService.getMimeType(image.getImageFile());
		if (!StringUtils.equals(mimeType, image.getContentType())) {
			image.setContentType(mimeType);
			modelService.updateItem(image, priviledged);
		}
	}
	
	public void synchronizeMetaData(Image image, Priviledged priviledged) throws EndUserException {
		ImageMetaData metaData = getMetaData(image.getImageFile());
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

	public ImageInfo getImageInfo(Image image) {
		ImageInfo info = new ImageInfo();
		info.setId(image.getId());
		info.setName(image.getName());
		info.setTaken(image.getPropertyDateValue(Property.KEY_PHOTO_TAKEN));
		info.setDescription(image.getPropertyValue(Image.PROPERTY_DESCRIPTION));
		info.setCameraMake(image.getPropertyValue(Property.KEY_PHOTO_CAMERA_MAKE));
		info.setCameraModel(image.getPropertyValue(Property.KEY_PHOTO_CAMERA_MODEL));
		info.setTags(image.getPropertyValues(Property.KEY_COMMON_TAG));
		return info;
	}

	public void setFileService(FileService fileService) {
		this.fileService = fileService;
	}

	public FileService getFileService() {
		return fileService;
	}
}
