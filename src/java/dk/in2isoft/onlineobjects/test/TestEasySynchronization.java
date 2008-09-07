package dk.in2isoft.onlineobjects.test;

import dk.in2isoft.onlineobjects.apps.school.SynchronizerStage;
import dk.in2isoft.onlineobjects.apps.school.sync.EasyFetcherStage;
import dk.in2isoft.onlineobjects.pipes.Pipeline;

public class TestEasySynchronization extends AbstractTestCase {
	
	public void test() {
		Pipeline pipeline = new Pipeline();
		
		//FileFetcherStage fetcher = new FileFetcherStage("http://localhost/~jbm/elevskema.csv");
		
		EasyFetcherStage fetcher = new EasyFetcherStage();
		fetcher.setServerName(properties.getProperty("easy.server.name"));
		fetcher.setPortNumber(Integer.parseInt(properties.getProperty("easy.port.number")));
		fetcher.setDatabaseName(properties.getProperty("easy.database.name"));
		fetcher.setUser(properties.getProperty("easy.user"));
		fetcher.setPassword(properties.getProperty("easy.password"));
		fetcher.setMaxRows(20);
		pipeline.addStage(fetcher);
		
		//pipeline.addStage(new CSVParserStage());
		//pipeline.addStage(new LoggingStage());
		SynchronizerStage synchronizer = new SynchronizerStage();
		synchronizer.setMaxDelete(1);
		pipeline.addStage(synchronizer);
		
		pipeline.run();
	}
}
