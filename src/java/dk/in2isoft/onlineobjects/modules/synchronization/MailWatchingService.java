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

public class MailWatchingService {
	
	private static Logger log = Logger.getLogger(MailWatchingService.class);

	private Date latest = new Date();
	
	private boolean running;
	
	private MailListener mailListener;
	
	public void check() {
		if (running) {
			return;
		}
		running = true;
		Properties props = System.getProperties();
		props.setProperty("mail.store.protocol", "imaps");
		Store store = null;
		Date nextAfterThis = null;
		try {
			Session session = Session.getDefaultInstance(props, null);
			store = session.getStore("imaps");
			store.connect("imap.gmail.com", "onlineobjects@in2isoft.dk", "0heimdal+");

			Folder inbox = store.getFolder("Inbox");
			inbox.open(Folder.READ_ONLY);
			Date date = latest;
			nextAfterThis = new Date();
			SearchTerm term = new ReceivedDateTerm(ComparisonTerm.GT, date);
			log.info("Searcing for mail later than "+date);
			Message[] messages = inbox.search(term);
			log.info("Checking new messages: "+messages.length);
			for (int i = 0; i < messages.length; i++) {
				
				Message message = messages[i];
				if (message.getReceivedDate().getTime()>date.getTime()) {
					mailListener.mailArrived(message);
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
			if (nextAfterThis!=null) {
				latest = nextAfterThis;
			}
			log.info("Finished new date = "+latest);
			running = false;
		}
	}
	
	public void setMailListener(MailListener mailListener) {
		this.mailListener = mailListener;
	}
}
