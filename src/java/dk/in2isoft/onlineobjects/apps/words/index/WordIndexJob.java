package dk.in2isoft.onlineobjects.apps.words.index;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import dk.in2isoft.onlineobjects.modules.index.WordIndexer;
import dk.in2isoft.onlineobjects.modules.scheduling.ServiceBackedJob;

public class WordIndexJob extends ServiceBackedJob {
	
	public void execute(JobExecutionContext context) throws JobExecutionException {
		WordIndexer wordIndexer = schedulingSupportFacade.getWordIndexer();
		wordIndexer.rebuild();
	}

}
