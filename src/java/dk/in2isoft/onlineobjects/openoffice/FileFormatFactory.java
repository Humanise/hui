package dk.in2isoft.onlineobjects.openoffice;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class FileFormatFactory {

	private static FileFormatFactory instance;
	
	private List<FileFormat> formats;
	
	private FileFormatFactory() {
		formats = new ArrayList<FileFormat>();

		formats.add(new FileFormat("pdf","application/pdf","writer_pdf_Export"));
		formats.add(new FileFormat("doc","application/msword","MS Word 2003 XML"));
		formats.add(new FileFormat("ppt","application/mspowerpoint","MS PowerPoint 97"));
		formats.add(new FileFormat("svg","image/svg+xml","draw_svg_Export"));
		formats.add(new FileFormat("html","text/html","HTML (StarWriter)"));
	}
	
	public static FileFormatFactory getInstance() {
		if (instance==null) {
			instance = new FileFormatFactory();
		}
		return instance;
	}
	
	public FileFormat getByExtension(String extension) {
		FileFormat format = null;
		for (Iterator<FileFormat> iter = formats.iterator(); iter.hasNext();) {
			FileFormat ff = iter.next();
			if (ff.getExtension().equalsIgnoreCase(extension)) {
				format = ff;
				break;
			}
		}
		return format;
	}
	
}
