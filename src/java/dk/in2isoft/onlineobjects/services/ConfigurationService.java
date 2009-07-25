package dk.in2isoft.onlineobjects.services;

public class ConfigurationService {
	private String baseUrl;
	private String storagePath;
	private boolean developmentMode;
	private String imageMagickPath;
	private String graphvizPath;

	public void setBaseUrl(String baseUrl) {
		this.baseUrl = baseUrl;
	}

	public String getBaseUrl() {
		return baseUrl;
	}

	public void setDevelopmentMode(boolean developmentMode) {
		this.developmentMode = developmentMode;
	}

	public boolean isDevelopmentMode() {
		return developmentMode;
	}

	public void setStoragePath(String storagePath) {
		this.storagePath = storagePath;
	}

	public String getStoragePath() {
		return storagePath;
	}

	public void setImageMagickPath(String imageMagickPath) {
		this.imageMagickPath = imageMagickPath;
	}

	public String getImageMagickPath() {
		return imageMagickPath;
	}

	public void setGraphvizPath(String graphvizPath) {
		this.graphvizPath = graphvizPath;
	}

	public String getGraphvizPath() {
		return graphvizPath;
	}
}
