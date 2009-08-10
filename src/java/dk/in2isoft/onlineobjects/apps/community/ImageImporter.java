package dk.in2isoft.onlineobjects.apps.community;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.importing.ImportListerner;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.images.ImageService;

class ImageImporter implements ImportListerner {
	
	private ModelService modelService;
	private ImageService imageService;
	private List<Image> importedImages;
	
	public ImageImporter(ModelService modelService,ImageService imageService) {
		super();
		this.modelService = modelService;
		this.imageService = imageService;
		importedImages = new ArrayList<Image>();
	}

	public void processFile(File file, String mimeType, String name,
			Request request) throws IOException, EndUserException {

		int[] dimensions = imageService.getImageDimensions(file);
		Image image = new Image();
		modelService.createItem(image,request.getSession());
		image.setName(name);
		image.changeImageFile(file, dimensions[0],dimensions[1], mimeType);
		imageService.synchronizeMetaData(image, request.getSession());
		modelService.updateItem(image,request.getSession());
		modelService.commit();
		importedImages.add(image);
	}

	public String getProcessName() {
		return "imageImport";
	}
	
	public List<Image> getImportedImages() {
		return importedImages;
	}
}