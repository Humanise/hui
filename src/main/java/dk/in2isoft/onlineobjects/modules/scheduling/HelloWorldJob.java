package dk.in2isoft.onlineobjects.modules.scheduling;

import org.apache.log4j.Logger;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;


public class HelloWorldJob extends ServiceBackedJob {
	
	private static final Logger log = Logger.getLogger(HelloWorldJob.class);
	
	public void execute(JobExecutionContext context) throws JobExecutionException {
		log.info("Starting");
		JobStatus status = getStatus(context);
		for (int i = 1; i <= 10; i++) {
			try {Thread.sleep(1000);} catch (InterruptedException e) {e.printStackTrace();}
			float progress = (float)i/10f;
			log.info("Progress: "+Math.round(progress*100)+"%");
			status.setProgress(progress);
		}
		log.info("Finished");
	}

}
