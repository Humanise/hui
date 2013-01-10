package dk.in2isoft.commons.lang;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;

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
}
