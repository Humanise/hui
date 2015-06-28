package dk.in2isoft.onlineobjects.tasks;

import org.apache.log4j.Logger;
import org.junit.Test;
import org.quartz.utils.Key;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.modules.information.InformationService;
import dk.in2isoft.onlineobjects.modules.scheduling.JobStatus;
import dk.in2isoft.onlineobjects.modules.scheduling.SchedulingService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTask;

public class TestImportInformation extends AbstractSpringTask {

	private final static Logger log = Logger.getLogger(TestImportInformation.class);

	private InformationService informationService;
	private SchedulingService schedulingService;
	
	@Test
	public void run() throws ModelException {
		JobStatus status = new JobStatus();
		status.setLog(log);
		status.setKey(new Key<String>("Key", "Hey"));
		status.setSchedulingService(schedulingService);
		informationService.importInformation("http://politiken.dk/rss/senestenyt.rss", status);
	}
	
	@Autowired
	public void setInformationService(InformationService informationService) {
		this.informationService = informationService;
	}

	@Autowired
	public void setSchedulingService(SchedulingService schedulingService) {
		this.schedulingService = schedulingService;
	}
}