package dk.in2isoft.onlineobjects.openoffice;

public class FileFormat {
	private String extension;
	private String mimeType;
	private String converter;
	
	public FileFormat(String extension,String mimeType,String converter) {
		this.extension = extension;
		this.mimeType = mimeType;
		this.converter = converter;
	}
	
	public String getConverter() {
		return converter;
	}
	public String getExtension() {
		return extension;
	}
	public String getMimeType() {
		return mimeType;
	}
}
