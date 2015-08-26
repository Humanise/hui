package dk.in2isoft.onlineobjects.modules.information;

import java.util.List;

import org.quartz.DisallowConcurrentExecution;
import org.quartz.InterruptableJob;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.UnableToInterruptJobException;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.modules.scheduling.JobStatus;
import dk.in2isoft.onlineobjects.modules.scheduling.ServiceBackedJob;

@DisallowConcurrentExecution
public class InformationSpiderJob extends ServiceBackedJob implements InterruptableJob {

	private boolean interrupted;
	
	public void execute(JobExecutionContext context) throws JobExecutionException {
		InformationService informationService = schedulingSupportFacade.getInformationService();
		
		List<String> feeds = Lists.newArrayList(

				"http://daringfireball.net/index.xml",
				"http://www.appleinsider.com/appleinsider.rss",

				"http://politiken.dk/rss/senestenyt.rss",
				"http://politiken.dk/rss/newsinenglish.rss",
				"http://politiken.dk/rss/udland.rss",
				"http://politiken.dk/rss/indland.rss",
				"http://politiken.dk/rss/viden.rss",

				"http://www.dr.dk/nyheder/service/feeds/allenyheder",
				"http://borsen.dk/rss/",
				"http://www.b.dk/feeds/rss/Kronikker",
				"http://www.bt.dk/bt/seneste/rss",
				"http://jp.dk/international/?service=rssfeed",
				"http://jp.dk/nyviden/?service=rssfeed",

				"http://alistapart.com/site/rss",
				"http://www.smashingmagazine.com/feed/",
				"http://www.conservationmagazine.org/feed/",
				"http://feeds.reuters.com/reuters/technologyNews?format=xml",
				"http://feeds.reuters.com/reuters/MostRead",
				"http://rss.cnn.com/rss/edition.rss",
				"http://rss.cnn.com/rss/cnn_latest.rss",
				"http://wp-tfap.appspot.com/?feed=tfa&type=rss2" // Wikipedia featured article
				//"https://www.sciencenews.org/feeds/headlines.rss",
			);
		feeds = Lists.newArrayList("http://www.dr.dk/nyheder/service/feeds/allenyheder");
		JobStatus status = getStatus(context);
		int size = feeds.size();
		status.log("Starting information spider");
		for (int i = 0; i < size; i++) {
			if (interrupted) {
				status.log("Interrupting information spider");
				break;
			}
			String feed = feeds.get(i);
			status.log("Checking feed: "+feed);
			informationService.importInformation(feed,status);
			status.setProgress(i,size);
		}
		status.log("Information spider finished");
	}

	public void interrupt() throws UnableToInterruptJobException {
		interrupted = true;
	}

}
