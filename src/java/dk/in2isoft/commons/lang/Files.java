package dk.in2isoft.commons.lang;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.StringWriter;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;

public class Files {

	static public boolean deleteDirectory(File path) {
		if (path.exists()) {
			File[] files = path.listFiles();
			for (int i = 0; i < files.length; i++) {
				if (files[i].isDirectory()) {
					deleteDirectory(files[i]);
				} else {
					files[i].delete();
				}
			}
		}
		return (path.delete());
	}

	public static String formatFileSize(Number bytes) {
		return FileUtils.byteCountToDisplaySize(bytes.intValue());
	}

	public static boolean overwriteTextFile(String text, File file) {
		if (file.exists()) {
			file.delete();
		}
		FileOutputStream out = null;
		try {
			out = new FileOutputStream(file);
			IOUtils.write(text, out);
			return true;
		} catch (FileNotFoundException e) {
			// ignore
		} catch (IOException e) {
			// ignore
		} finally {
			IOUtils.closeQuietly(out);
		}
		return false;
	}


	public static String readString(File file) {
		return readString(file, Strings.UTF8);
	}
	
	public static String readString(File file, String encoding) {
		if (encoding==null) {
			encoding = Strings.UTF8;
		}
		FileInputStream inputStream = null;
		StringWriter writer = null;
		try {
			writer = new StringWriter();
			inputStream = new FileInputStream(file);
			IOUtils.copy(inputStream, writer, encoding);
			return writer.toString();
		} catch (FileNotFoundException e) {
			// Ignore
		} catch (IOException e) {
			// Ignore
		} finally {
			IOUtils.closeQuietly(inputStream);			
			IOUtils.closeQuietly(writer);			
		}
		
		return null;
	}

	public static String cleanFileName(String fileName) {
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
		fileName = StringUtils.replace(fileName, "-", " ");
		fileName = fileName.replaceAll("[ ]+", " ");
		return fileName;
	}
}
