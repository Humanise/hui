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

import dk.in2isoft.onlineobjects.modules.surveillance.SurveillanceService;

public class MailWatchingService {
	
	private static Logger log = Logger.getLogger(MailWatchingService.class);

	private Date latest = new Date();
	
	private boolean running;
	
	private MailListener mailListener;
	private SurveillanceService surveillanceService;
	
	public void check() {
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
			Session session = Session.getDefaultInstance(props, null);
			store = session.getStore("imaps");
			store.connect("imap.gmail.com", "onlineobjects@in2isoft.dk", "0heimdal+");

			Folder inbox = store.getFolder("Inbox");
			inbox.open(Folder.READ_ONLY);
			SearchTerm term = new ReceivedDateTerm(ComparisonTerm.GT, latest);
			log.info("Searcing for mail later than "+latest);
			Message[] messages = inbox.search(term);
			log.info("Checking new messages: "+messages.length);
			for (int i = 0; i < messages.length; i++) {
				
				Message message = messages[i];
				if (message.getReceivedDate().getTime()>latest.getTime()) {
					numberOfNewMessages++;
					mailListener.mailArrived(message);
					latest = message.getReceivedDate();
				} else {
					log.info("Skipping message: "+message.getSubject()+" / received: "+message.getReceivedDate()+" / sent: "+message.getSentDate());
				}
			}
		} catch (NoSuchProviderException e) {
			log.error("Unable to check for mail", e);
		} catch (MessagingException e) {
			log.error("Unable to check for mail", e);
		} finally {
			if (store!=null) {
				try { store.close(); } catch (MessagingException ignore) {}
			}
			surveillanceService.logInfo("Emails found: "+numberOfNewMessages, "");
			log.info("Finished new date = "+latest);
			running = false;
		}
	}
	
	public void setMailListener(MailListener mailListener) {
		this.mailListener = mailListener;
	}
	
	public void setSurveillanceService(SurveillanceService surveillanceService) {
		this.surveillanceService = surveillanceService;
	}
}
