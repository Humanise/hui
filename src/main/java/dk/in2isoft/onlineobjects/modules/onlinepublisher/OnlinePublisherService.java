package dk.in2isoft.onlineobjects.modules.onlinepublisher;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

import dk.in2isoft.onlineobjects.apps.words.views.util.UrlBuilder;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Pile;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.modules.networking.NetworkResponse;
import dk.in2isoft.onlineobjects.modules.networking.NetworkService;
import dk.in2isoft.onlineobjects.modules.scheduling.JobStatus;
import dk.in2isoft.onlineobjects.services.PileService;

public class OnlinePublisherService {

	private ModelService modelService;
	private PileService pileService;
	private SecurityService securityService;
	private NetworkService networkService;

	public List<InternetAddress> getSites(Privileged privileged) throws ModelException {
		Pile pile = getPile(privileged);
		Query<InternetAddress> query = Query.after(InternetAddress.class).from(pile);
		return modelService.list(query);
	}

	public void callAllPublishers(JobStatus status) {
		status.log("Performing heart massage");
		Privileged privileged = securityService.getPublicUser();
		try {
			List<InternetAddress> sites = getSites(privileged);
			int index = 0;
			for (InternetAddress internetAddress : sites) {
				UrlBuilder url = new UrlBuilder(internetAddress.getAddress());
				url.folder("services").folder("heartbeat");
				status.log("Calling: " + url);
				NetworkResponse response = null;
				try {
					response = networkService.get(url.toString());
					if (response.isSuccess()) {
						status.log("Success: " + url);
					} else {
						status.log("Failure: " + url);
					}
				} catch (URISyntaxException e) {
					status.error("Invalid address: " + url,e);
				} catch (IOException e) {
					status.error("Failed to request address: " + url,e);
				} finally {
					if (response!=null) {
						response.cleanUp();
					}
				}
				status.setProgress(index, sites.size());
				index++;
			}
		} catch (ModelException e) {
			status.error("A problem happened in the model", e);
		}
		status.setProgress(1);
		status.log("Heart massage finished");
	}

	public void createOrUpdatePublisher(PublisherPerspective perspective, Privileged privileged) throws IllegalRequestException, ModelException, ContentNotFoundException, SecurityException {
		if (perspective == null) {
			throw new IllegalRequestException("No publisher provider");
		}
		InternetAddress address;
		if (perspective.getId() > 0) {
			address = modelService.get(InternetAddress.class, perspective.getId(), privileged);
			if (address == null) {
				throw new ContentNotFoundException("Internet address not found (id=" + perspective.getId() + ")");
			}
		} else {
			address = new InternetAddress();
		}
		address.setAddress(perspective.getAddress());
		address.setName(perspective.getName());
		modelService.createOrUpdateItem(address, privileged);
		Pile pile = getPile(privileged);
		Relation relation = modelService.getRelation(pile, address);
		if (relation==null) {
			modelService.createRelation(pile, address, privileged);
		}
	}

	public PublisherPerspective getPublisherPerspective(Long id, Privileged privileged) throws ModelException, ContentNotFoundException {
		InternetAddress internetAddress = modelService.get(InternetAddress.class, id, privileged);
		if (internetAddress!=null) {
			PublisherPerspective perspective = new PublisherPerspective();
			perspective.setId(internetAddress.getId());
			perspective.setAddress(internetAddress.getAddress());
			perspective.setName(internetAddress.getName());
			return perspective;
		}
		throw new ContentNotFoundException("The internet address does not exists: id="+id);
	}

	public void deletePublisher(Long id, Privileged privileged) throws ModelException, SecurityException {
		InternetAddress internetAddress = modelService.get(InternetAddress.class, id, privileged);
		if (internetAddress!=null) {
			modelService.deleteEntity(internetAddress, privileged);
		}
	}

	private Pile getPile(Privileged privileged) throws ModelException {
		return pileService.getOrCreateGlobalPile("onlinepublisher.sites", privileged);
	}
	
	// Wiring...

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public void setPileService(PileService pileService) {
		this.pileService = pileService;
	}

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}
	
	public void setNetworkService(NetworkService networkService) {
		this.networkService = networkService;
	}
}
