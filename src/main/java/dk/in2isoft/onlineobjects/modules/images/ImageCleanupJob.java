package dk.in2isoft.onlineobjects.modules.images;

import java.util.List;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.modules.scheduling.ServiceBackedJob;
import dk.in2isoft.onlineobjects.services.FileService;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class ImageCleanupJob extends ServiceBackedJob {

	
	public void execute(JobExecutionContext context) throws JobExecutionException {
		ModelService modelService = schedulingSupportFacade.getModelService();
		ImageService imageService = schedulingSupportFacade.getImageService();
		FileService fileService = schedulingSupportFacade.getFileService();
		User admin = modelService.getUser(SecurityService.ADMIN_USERNAME);
		List<Image> list = modelService.list(Query.of(Image.class));
		for (Image image : list) {
			try {
				String name = image.getName();
				if (name!=null && name.toLowerCase().endsWith(".jpg")) {
					image.setName(fileService.cleanFileName(name));
					modelService.updateItem(image, admin);
				}
				imageService.synchronizeContentType(image, admin);
				imageService.synchronizeMetaData(image,admin);
				modelService.commit();
			} catch (EndUserException e) {
				
			}
		}
	}

}
