package dk.in2isoft.onlineobjects.services;

import dk.in2isoft.onlineobjects.importing.DataImporter;

public class ImportService {
	
	private FileService fileService;

	public DataImporter createImporter() {
		return new DataImporter(fileService);
	}

	public void setFileService(FileService fileService) {
		this.fileService = fileService;
	}

	public FileService getFileService() {
		return fileService;
	}
}
