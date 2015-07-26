package dk.in2isoft.onlineobjects.test.traffic;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import javax.mail.Address;
import javax.mail.BodyPart;
import javax.mail.Folder;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.NoSuchProviderException;
import javax.mail.Session;
import javax.mail.Store;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMultipart;
import javax.mail.search.ComparisonTerm;
import javax.mail.search.SearchTerm;
import javax.mail.search.SentDateTerm;

import org.apache.commons.io.IOUtils;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.SimpleEmail;
import org.apache.log4j.Logger;
import org.joda.time.DateTime;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;
import dk.in2isoft.onlineobjects.util.images.ImageService;

@Ignore
public class TestMail extends AbstractSpringTestCase {
	
	private static final Logger log = Logger.getLogger(TestMail.class);
	
	@Autowired
	private ImageService imageService;

	//@Test
	public void testSimpleMail() throws EmailException {
		SimpleEmail email = new SimpleEmail();
		email.setHostName(getProperty("mail.hostname"));
		email.setAuthentication(getProperty("mail.user"), getProperty("mail.password"));
		email.addTo(getProperty("mail.address"), getProperty("mail.name"));
		email.setFrom(getProperty("mail.address"), getProperty("mail.name"));
		email.setSubject("Test message");
		email.setMsg("This is a simple test of commons-email");
		email.setSSL(true);
		email.send();
	}
	
	@Test
	public void testRead() {
		Properties props = System.getProperties();
		props.setProperty("mail.store.protocol", "imaps");
		try {
			Session session = Session.getDefaultInstance(props, null);
			Store store = session.getStore("imaps");
			store.connect("imap.gmail.com", getProperty("mail.user"), getProperty("mail.password"));
			System.out.println(store);

			Folder inbox = store.getFolder("Inbox");
			inbox.open(Folder.READ_ONLY);
			SearchTerm term = new SentDateTerm(ComparisonTerm.GT, DateTime.now().minusHours(3).toDate());
			Message[] messages = inbox.search(term);
			//Message messages[] = inbox.getMessages();
			for (int i = 0; i < messages.length && i<10; i++) {
				Message message = messages[i];
				Address[] from = message.getFrom();
				log.info(message.getSubject()+" / "+message.getSentDate()+" / "+message.getFrom());
				String usersEmail = null;
				for (Address address : from) {
					if (address instanceof InternetAddress) {
						InternetAddress iad = (InternetAddress) address;
						log.info("From: "+iad.getAddress()+" / "+iad.getPersonal());
						usersEmail = iad.getAddress();
					}
				}
				
				try {
					Object content = message.getContent();
					if (content instanceof Multipart) {
						Multipart mp = (Multipart) content;
						int count = mp.getCount();
						log.info("Parts: "+count);
						for (int j = 0; j < count; j++) {
							BodyPart part = mp.getBodyPart(j);
							String contentType = part.getContentType();
							log.info("-- part-type: "+contentType);
							log.info("-- part-disp: "+part.getDisposition());
							
							if (contentType.toLowerCase().startsWith("image/jpg")) {
								handleImage(usersEmail,"image/jpg",part.getInputStream());
							}
							else if (contentType.startsWith("multipart")) {
								MimeMultipart x = new MimeMultipart(part.getDataHandler().getDataSource());
								log.info("SUB: "+x.getCount());
								
								for (int k = 0; k < x.getCount(); k++) {
									BodyPart subPart = x.getBodyPart(k);
									String subContentType = subPart.getContentType();
									log.info(" ------- "+subContentType);
									if (subContentType.toLowerCase().startsWith("image/jpg")) {
										handleImage(usersEmail,"image/jpg",subPart.getInputStream());
									}
								}
								
							}
						}
					} else {
						log.info("Content: "+content);
					}
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		} catch (NoSuchProviderException e) {
			e.printStackTrace();
			System.exit(1);
		} catch (MessagingException e) {
			e.printStackTrace();
			System.exit(2);
		}

	}

	private void handleImage(String usersEmail, String mimeType, InputStream inputStream) {
		log.info("Image from: "+usersEmail+" of type: "+mimeType+"...");
		FileOutputStream output = null;
		try {
			File tempFile = File.createTempFile(usersEmail, null);
			tempFile.deleteOnExit();
			output = new FileOutputStream(tempFile);
			IOUtils.copy(inputStream, output);
			imageService.createImageFromFile(tempFile, "Imported from mail", modelService.getUser(SecurityService.ADMIN_USERNAME));
			//log.info(IOUtils.toString(inputStream));
		} catch (IOException e) {
			log.error("Unable to get stream");
		} catch (ModelException e) {
			log.error("Unable to create image",e);
		} finally {
			IOUtils.closeQuietly(output);
			IOUtils.closeQuietly(inputStream);
		}
	}
	
	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}
}
