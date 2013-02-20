package dk.in2isoft.onlineobjects.services;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringWriter;
import java.util.Collection;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;

import com.google.common.collect.Maps;

import dk.in2isoft.commons.lang.Files;
import eu.medsea.mimeutil.MimeType;
import eu.medsea.mimeutil.MimeUtil2;

public class FileService {

	private MimeUtil2 mimeUtil;
	private Map<String,String> mimeTypeToFileName;
	
	public FileService() {
		mimeUtil = new MimeUtil2();
		mimeUtil.registerMimeDetector("eu.medsea.mimeutil.detector.ExtensionMimeDetector");
		mimeUtil.registerMimeDetector("eu.medsea.mimeutil.detector.MagicMimeMimeDetector");
		mimeTypeToFileName = Maps.newHashMap();
		mimeTypeToFileName.put("image/jpeg","jpg");
		mimeTypeToFileName.put("video/quicktime","mov");
		mimeTypeToFileName.put("video/mp4", "mp4");
	}

	public String getMimeType(File file) {
		Collection<?> types = mimeUtil.getMimeTypes(file);
		MimeType mimeType = MimeUtil2.getMostSpecificMimeType(types);
		return mimeType.toString();
	}
	
	public String getExtensionForMimeType(String mimeType) {
		return mimeTypeToFileName.get(mimeType);
	}
	
	public String getSafeFileName(String name, String extension) {
		StringBuilder sb = new StringBuilder();
		if (StringUtils.isBlank(name)) {
			sb.append("untitled");
		} else {
			sb.append(name.trim().toLowerCase().replaceAll("[\\W]+", "_"));
		}
		if (!StringUtils.isBlank(extension)) {
			sb.append(".").append(extension);
		}
		return sb.toString();
	}
	
	public String cleanFileName(String fileName) {
		return Files.cleanFileName(fileName);
	}
	
	public static String readTextUTF8(File file) throws IOException {
		InputStream is = new BufferedInputStream(new FileInputStream(file));
		Reader reader = new InputStreamReader(is, "UTF-8");
		StringWriter writer = new StringWriter();
		IOUtils.copy(reader, writer);
		return writer.getBuffer().toString();
	}
}
