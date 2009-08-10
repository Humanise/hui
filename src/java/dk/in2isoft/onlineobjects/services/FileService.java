package dk.in2isoft.onlineobjects.services;

import java.io.File;
import java.util.Collection;

import org.apache.commons.lang.StringUtils;

import eu.medsea.mimeutil.MimeType;
import eu.medsea.mimeutil.MimeUtil2;

public class FileService {

	private MimeUtil2 mimeUtil;

	public FileService() {
		mimeUtil = new MimeUtil2();
		mimeUtil.registerMimeDetector("eu.medsea.mimeutil.detector.ExtensionMimeDetector");
		mimeUtil.registerMimeDetector("eu.medsea.mimeutil.detector.MagicMimeMimeDetector");
	}

	public String getMimeType(File file) {
		Collection<?> types = mimeUtil.getMimeTypes(file);
		MimeType mimeType = MimeUtil2.getMostSpecificMimeType(types);
		return mimeType.toString();
	}
	
	public String cleanFileName(String fileName) {
		if (fileName==null) {
			return null;
		}
		int i = fileName.indexOf(".");
		if (i!=-1) {
			fileName = fileName.substring(0,i);
		}
		i = fileName.lastIndexOf("\\");
		if (i!=-1) {
			fileName = fileName.substring(i+1);
		}
		fileName = StringUtils.capitalize(fileName);
		fileName = StringUtils.replace(fileName, "_", " ");
		return fileName;
	}
}
