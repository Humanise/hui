package dk.in2isoft.onlineobjects.modules.synchronization;

import java.util.Date;
import java.util.Properties;

import javax.mail.Folder;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.NoSuchProviderException;
import javax.mail.Session;
import javax.mail.Store;
import javax.mail.search.ComparisonTerm;
import javax.mail.search.ReceivedDateTerm;
import javax.mail.search.SearchTerm;

import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.modules.scheduling.JobStatus;
import dk.in2isoft.onlineobjects.modules.surveillance.SurveillanceService;
import dk.in2isoft.onlineobjects.services.EmailService;

public class MailWatchingService {
	
	private static Logger log = Logger.getLogger(MailWatchingService.class);

	private Date latest = new Date();
	
	private boolean running;
	
	private MailListener mailListener;
	private SurveillanceService surveillanceService;
	private EmailService emailService;
	
	public void check(JobStatus status) {
		if (running) {
			return;
		}
		running = true;
		Properties props = System.getProperties();
		props.setProperty("mail.store.protocol", "imaps");
		Store store = null;
		int numberOfNewMessages = 0;
		try {
			surveillanceService.logInfo("Checking for new mail", "Finding mail after: "+latest);

			status.log("Connecting to mail server");			
			Session session = Session.getDefaultInstance(props, null);
			store = session.getStore("imaps");
			store.connect(emailService.getHost(), emailService.getUsername(), emailService.getPassword());
			status.setProgress(0);
			Folder inbox = store.getFolder("Inbox");
			inbox.open(Folder.READ_ONLY);
			SearchTerm term = new ReceivedDateTerm(ComparisonTerm.GT, latest);
			status.log("Searcing for mail later than "+latest);
			Message[] messages = inbox.search(term);
			int count = messages.length;
			status.log("Server returned "+messages.length+" messages");
			for (int i = 0; i < count; i++) {
				Message message = messages[i];
				if (message.getReceivedDate().getTime()>latest.getTime()) {
					status.log("New message: "+message.getReceivedDate());
					numberOfNewMessages++;
					mailListener.mailArrived(message,status);
					latest = message.getReceivedDate();
				} else {
					log.debug("Skipping message: "+message.getSubject()+" / received: "+message.getReceivedDate()+" / sent: "+message.getSentDate());
				}
				status.setProgress(i,messages.length);
			}
			status.log("Finished checking new messages");
		} catch (NoSuchProviderException e) {
			status.error("Unable to check for mail", e);
		} catch (MessagingException e) {
			status.error("Unable to check for mail", e);
		} finally {
			status.setProgress(1);
			if (store!=null) {
				try { store.close(); } catch (MessagingException ignore) {}
			}
			surveillanceService.logInfo("Emails found: "+numberOfNewMessages, "");
			running = false;
		}
	}
	
	public void setMailListener(MailListener mailListener) {
		this.mailListener = mailListener;
	}
	
	public void setSurveillanceService(SurveillanceService surveillanceService) {
		this.surveillanceService = surveillanceService;
	}
	
	public void setEmailService(EmailService emailService) {
		this.emailService = emailService;
	}
}
