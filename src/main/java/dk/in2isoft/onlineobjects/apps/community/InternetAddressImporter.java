package dk.in2isoft.onlineobjects.apps.community;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.commons.parsing.HTMLReference;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.modules.importing.ImportListener;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.ui.Request;

class InternetAddressImporter implements ImportListener<Object> {

	private ModelService modelService;
	private HTMLService htmlService;

	public InternetAddressImporter(ModelService modelService, HTMLService htmlService) {
		super();
		this.modelService = modelService;
		this.htmlService = htmlService;
	}

	public void processFile(File file, String mimeType, String name, Map<String,String> parameters, Request request) throws IOException, EndUserException {
		HTMLDocument doc = htmlService.getDocumentSilently(file.toURI().toString());
		if (doc!=null) {
			List<HTMLReference> references = doc.getReferences();
			for (HTMLReference htmlReference : references) {
				InternetAddress address = new InternetAddress();
				address.setAddress(htmlReference.getUrl());
				address.setName(htmlReference.getText());
				modelService.createItem(address, request.getSession());
			}
		}
	}
	
	@Override
	public Object getResponse() {
		return null;
	}

	public String getProcessName() {
		return "internetAddressImport";
	}

}