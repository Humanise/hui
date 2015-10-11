package dk.in2isoft.onlineobjects.service.dependency;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import dk.in2isoft.onlineobjects.apps.videosharing.Path;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.service.ServiceController;
import dk.in2isoft.onlineobjects.ui.DependencyService;
import dk.in2isoft.onlineobjects.ui.Request;

public class DependencyController extends ServiceController {

	private static final String SCRIPT_PATH = "/[0-9]+/([0-9]+)\\.js";

	private static final String STYLE_PATH = "/[0-9]+/([0-9]+)\\.css";

	private DependencyService dependencyService;
	
	private Pattern scriptPattern = Pattern.compile(SCRIPT_PATH);
	private Pattern stylePattern = Pattern.compile(STYLE_PATH);

	public DependencyController() {
		super("dependency");
	}

	@Path(expression=SCRIPT_PATH)
	public void script(Request request) throws IOException, ContentNotFoundException {
		String path = request.getLocalPathAsString();
		Matcher matcher = scriptPattern.matcher(path);
		if (matcher.matches()) {
			String hash = matcher.group(1);
			dependencyService.respondScripts(hash,request);
		} else {
			throw new ContentNotFoundException();
		}
	}

	@Path(expression=STYLE_PATH)
	public void style(Request request) throws IOException, ContentNotFoundException {
		String path = request.getLocalPathAsString();
		Matcher matcher = stylePattern.matcher(path);
		if (matcher.matches()) {
			String hash = matcher.group(1);
			dependencyService.respondStyles(hash,request);
		} else {
			throw new ContentNotFoundException();
		}
	}
	
	public void setDependencyService(DependencyService dependencyService) {
		this.dependencyService = dependencyService;
	}
}
