package dk.in2isoft.onlineobjects.test;

import dk.in2isoft.onlineobjects.apps.school.SynchronizerStage;
import dk.in2isoft.onlineobjects.pipes.CSVParserStage;
import dk.in2isoft.onlineobjects.pipes.FileFetcherStage;
import dk.in2isoft.onlineobjects.pipes.Pipeline;

public class TestPipeline extends AbstractTestCase {
	
	public void test() {
		Pipeline pipeline = new Pipeline();
		
		FileFetcherStage fetcher = new FileFetcherStage("http://localhost/~jbm/elevskema.csv");
		
		pipeline.addStage(fetcher);
		
		pipeline.addStage(new CSVParserStage());
		//pipeline.addStage(new LoggingStage());
		
		pipeline.addStage(new SynchronizerStage());
		
		//pipeline.addStage(new CSVWriterStage(new File("/Users/jbm/Desktop/test.csv")));
		
		pipeline.run();
	}
}
