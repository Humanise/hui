package dk.in2isoft.onlineobjects.apps.words;

import java.io.IOException;

import dk.in2isoft.onlineobjects.apps.ApplicationController;
import dk.in2isoft.onlineobjects.apps.videosharing.RequestMapping;
import dk.in2isoft.onlineobjects.apps.words.importing.WordsImporter;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.importing.DataImporter;
import dk.in2isoft.onlineobjects.modules.importing.ImportSession;
import dk.in2isoft.onlineobjects.services.ImportService;
import dk.in2isoft.onlineobjects.ui.Request;

public class WordsController extends ApplicationController {

	private ImportService importService;

	public WordsController() {
		super("words");
		addJsfMatcher("/", "front.xhtml");
		addJsfMatcher("/<language>", "front.xhtml");
		addJsfMatcher("/<language>/word/<word>.html", "word.xhtml");
		addJsfMatcher("/<language>/import/<folder>", "import.xhtml");
		addJsfMatcher("/<language>/index/<word>", "index.xhtml");
		addJsfMatcher("/<language>/index/<word>/<integer>", "index.xhtml");
	}

	@Override
	public void unknownRequest(Request request)
	throws IOException,EndUserException {
		super.unknownRequest(request);
	}
	
	@Override
	public String getLanguage(Request request) {
		String[] path = request.getLocalPath();
		if (path.length>0) {
			return path[0];
		}
		return super.getLanguage(request);
	}
	
	@RequestMapping(start="upload")
	public void upload(Request request) throws IOException, EndUserException {
		ImportSession session = importService.createImportSession(request.getSession());
		DataImporter importer = importService.createImporter();
		WordsImporter listener = new WordsImporter();
		session.setHandler(listener);
		importer.setListener(listener);
		importer.setSuccessResponse(session.getId());
		importer.importMultipart(this, request);
	}
	
	public void setImportService(ImportService importService) {
		this.importService = importService;
	}
}
