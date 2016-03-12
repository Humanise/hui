package dk.in2isoft.onlineobjects.modules.networking;

import java.io.File;

import dk.in2isoft.commons.lang.Files;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.services.StorageService;

public class InternetAddressService {
	
	StorageService storageService;
	NetworkService networkService;
	ModelService modelService;

	public HTMLDocument getHTMLDocument(InternetAddress address, Privileged privileged) throws SecurityException, ModelException {

		File folder = storageService.getItemFolder(address);
		File original = new File(folder, "original");
		String encoding = address.getPropertyValue(Property.KEY_INTERNETADDRESS_ENCODING);
		if (!original.exists()) {
			NetworkResponse response = networkService.getSilently(address.getAddress());
			if (response != null && response.isSuccess()) {
				File temp = response.getFile();
				if (!Files.copy(temp, original)) {
					response.cleanUp();
					return null;
				}
				if (response.getEncoding()!=null) {
					encoding = response.getEncoding();
				}
				address.overrideFirstProperty(Property.KEY_INTERNETADDRESS_ENCODING, encoding);
				modelService.updateItem(address, privileged);
			}
		}
		if (Strings.isBlank(encoding)) {
			encoding = Strings.UTF8;
		}
		HTMLDocument htmlDocument = new HTMLDocument(Files.readString(original, encoding));
		htmlDocument.setOriginalUrl(address.getAddress());
		return htmlDocument;
	}
	
	// Wiring...
	
	public void setStorageService(StorageService storageService) {
		this.storageService = storageService;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setNetworkService(NetworkService networkService) {
		this.networkService = networkService;
	}
}
