package dk.in2isoft.onlineobjects.scheduling;

import org.apache.log4j.Logger;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.scheduling.quartz.QuartzJobBean;

import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.EmailService;

public class CallHomeJob extends QuartzJobBean {

	private static Logger log = Logger.getLogger(CallHomeJob.class);
	private EmailService emailService;
	private ConfigurationService configurationService;

	@Override
	protected void executeInternal(JobExecutionContext context) throws JobExecutionException {
		if (configurationService.isDevelopmentMode()) {
			return;
		}
		try {
			log.info("Calling home");
			emailService.sendMessage("I'm alive: "+configurationService.getBaseUrl(), "OnlineObjects is running, don't worry - be happy!", emailService.getDefaultSenderAddress());
			log.info("The call has been placed");
		} catch (EndUserException e) {
			log.error(e);
			throw new JobExecutionException(e);
		}
	}
	
	public void setEmailService(EmailService emailService) {
		this.emailService = emailService;
	}
	
	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}
}
