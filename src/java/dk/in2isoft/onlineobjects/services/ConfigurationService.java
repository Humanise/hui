package dk.in2isoft.onlineobjects.services;

public class ConfigurationService {
	private String baseUrl;
	private String storagePath;
	private boolean developmentMode;

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
}
