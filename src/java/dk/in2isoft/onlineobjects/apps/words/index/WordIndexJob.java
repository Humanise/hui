package dk.in2isoft.onlineobjects.apps.words.index;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import dk.in2isoft.onlineobjects.modules.index.WordIndexer;

public class WordIndexJob implements Job {
	
	private WordIndexer wordIndexer;

	public void execute(JobExecutionContext context) throws JobExecutionException {
		wordIndexer.rebuild();
	}

	public void setWordIndexer(WordIndexer wordIndexer) {
		this.wordIndexer = wordIndexer;
	}
}
