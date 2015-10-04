package dk.in2isoft.onlineobjects.service.dependency;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.service.ServiceController;
import dk.in2isoft.onlineobjects.ui.DependencyService;
import dk.in2isoft.onlineobjects.ui.Request;

public class DependencyController extends ServiceController {

	private static final String SCRIPT_PATH = "/[0-9]+/([0-9]+)\\.js";

	private DependencyService dependencyService;
	
	private Pattern scriptPattern = Pattern.compile(SCRIPT_PATH);

	public DependencyController() {
		super("dependency");
	}

	@Override
	public void unknownRequest(Request request) throws IOException, EndUserException {
		String[] localPath = request.getLocalPath();
		if (localPath.length == 1) {
			
		}
		
		request.sendObject(localPath);
	}

	@Path(expression=SCRIPT_PATH)
	public void script(Request request) throws IOException, ContentNotFoundException {
		String string = request.getLocalPathAsString();
		Matcher matcher = scriptPattern.matcher(string);
		if (matcher.matches()) {
			String hash = matcher.group(1);
			dependencyService.respondScripts(hash,request);
		} else {
			throw new ContentNotFoundException();
		}
	}
	
	public void setDependencyService(DependencyService dependencyService) {
		this.dependencyService = dependencyService;
	}
}
