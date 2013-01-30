package dk.in2isoft.onlineobjects.modules.information;

import org.quartz.DisallowConcurrentExecution;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import dk.in2isoft.onlineobjects.modules.scheduling.ServiceBackedJob;

@DisallowConcurrentExecution
public class InformationSpiderJob extends ServiceBackedJob {

	public void execute(JobExecutionContext context) throws JobExecutionException {
		InformationService informationService = schedulingSupportFacade.getInformationService();
		informationService.importInformation("http://daringfireball.net/index.xml");
		informationService.importInformation("http://www.appleinsider.com/appleinsider.rss");
		informationService.importInformation("http://politiken.dk/rss/senestenyt.rss");
		informationService.importInformation("http://www.dr.dk/nyheder/service/feeds/allenyheder");
		informationService.importInformation("http://www.b.dk/feeds/rss/Kronikker");
		informationService.importInformation("http://alistapart.com/site/rss");
	}

}
