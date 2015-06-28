package dk.in2isoft.onlineobjects.services;

import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.modules.importing.DataImporter;
import dk.in2isoft.onlineobjects.modules.importing.ImportSession;

public class ImportService {
	
	private FileService fileService;
	
	private SessionService sessionService;
		
	public ImportService() {
	}

	public DataImporter createImporter() {
		return new DataImporter(fileService);
	}

	public ImportSession createImportSession(UserSession userSession) {
		ImportSession session = new ImportSession();
		session.setUserSessionId(userSession.getId());
		sessionService.registerSubSession(session);
		return session;
	}

	public void setSessionService(SessionService sessionService) {
		this.sessionService = sessionService;
	}
	
	public void setFileService(FileService fileService) {
		this.fileService = fileService;
	}

	public FileService getFileService() {
		return fileService;
	}

	public ImportSession getImportSession(String id) {
		ImportSession session = sessionService.getSubSession(id,ImportSession.class);
		return session;
	}
	
}
