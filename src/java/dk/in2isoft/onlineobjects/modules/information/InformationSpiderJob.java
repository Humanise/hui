package dk.in2isoft.onlineobjects.modules.information;

import java.util.List;

import org.quartz.DisallowConcurrentExecution;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.modules.scheduling.ServiceBackedJob;

@DisallowConcurrentExecution
public class InformationSpiderJob extends ServiceBackedJob {

	public void execute(JobExecutionContext context) throws JobExecutionException {
		InformationService informationService = schedulingSupportFacade.getInformationService();
		
		List<String> feeds = Lists.newArrayList(

				"http://feeds2.feedburner.com/3quarksdaily",
				"http://daringfireball.net/index.xml",
				"http://www.appleinsider.com/appleinsider.rss",
				"http://politiken.dk/rss/senestenyt.rss",
				"http://www.dr.dk/nyheder/service/feeds/allenyheder",
				"http://www.b.dk/feeds/rss/Kronikker",
				"http://alistapart.com/site/rss",
				"http://www.bt.dk/bt/seneste/rss",
				"http://www.sciencenews.org/view/feed/label_id/2365/name/Life.rss",
				"http://rss1.smashingmagazine.com/feed/",
				"http://www.conservationmagazine.org/feed/",
				"http://feeds.reuters.com/reuters/technologyNews?format=xml",
				"http://feeds.reuters.com/reuters/MostRead",
				"http://rss.cnn.com/rss/edition.rss",
				"http://rss.cnn.com/rss/cnn_latest.rss",
				"http://politiken.dk/rss/klima.rss",
				"http://politiken.dk/rss/boger.rss",
				"http://politiken.dk/rss/bagsiden.rss",
				"http://politiken.dk/rss/videnskab.rss",
				"http://jp.dk/international/?service=rssfeed"
			);
		for (String feed : feeds) {
			informationService.importInformation(feed);
		}
		
	}

}
