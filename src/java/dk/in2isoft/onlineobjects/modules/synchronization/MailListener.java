package dk.in2isoft.onlineobjects.modules.synchronization;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.mail.Address;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMultipart;

import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.apps.community.services.MemberService;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.modules.surveillance.SurveillanceService;
import dk.in2isoft.onlineobjects.services.FileService;
import dk.in2isoft.onlineobjects.util.images.ImageService;

public class MailListener {

	private static final Logger log = Logger.getLogger(MailListener.class);

	private ModelService modelService;
	private ImageService imageService;
	private FileService fileService;
	private MemberService memberService;
	private SurveillanceService surveillanceService;
	
	public void mailArrived(Message message) {
		Address[] from;
		boolean recognized = false;
		String subject = null;
		try {
			from = message.getFrom();
			subject = message.getSubject();
			log.info(message.getSubject() + " / " + message.getSentDate() + " / " + message.getFrom());
			String usersEmail = null;
			for (Address address : from) {
				if (address instanceof InternetAddress) {
					InternetAddress iad = (InternetAddress) address;
					log.info("From: " + iad.getAddress() + " / " + iad.getPersonal());
					usersEmail = iad.getAddress();
				}
			}

			Object content = message.getContent();
			
			// If the email is multi part...
			if (content instanceof Multipart) {
				Multipart mp = (Multipart) content;
				int count = mp.getCount();
				log.info("Parts: " + count);
				for (int j = 0; j < count; j++) {
					BodyPart part = mp.getBodyPart(j);
					String contentType = part.getContentType();
					
					log.info("-- part-type: " + contentType);
					log.info("-- part-disp: " + part.getDisposition());

					if (contentType.toLowerCase().startsWith("image/jpg") || contentType.toLowerCase().startsWith("image/jpeg")) {
						recognized = true;
						handleImage(usersEmail, "image/jpg",part.getFileName(), message.getSubject(), part.getInputStream());
					} else if (contentType.toLowerCase().startsWith("image/png")) {
						recognized = true;
						handleImage(usersEmail, "image/png",part.getFileName(), message.getSubject(), part.getInputStream());
					} else if (contentType.startsWith("multipart")) {
						MimeMultipart x = new MimeMultipart(part.getDataHandler().getDataSource());
						log.info("SUB: " + x.getCount());

						for (int k = 0; k < x.getCount(); k++) {
							BodyPart subPart = x.getBodyPart(k);
							String subContentType = subPart.getContentType();
							log.info(" ------- " + subContentType);
							if (subContentType.toLowerCase().startsWith("image/jpg") || subContentType.toLowerCase().startsWith("image/jpeg")) {
								recognized = true;
								handleImage(usersEmail, "image/jpg", subPart.getFileName(), message.getSubject(), subPart.getInputStream());
							} else if (contentType.toLowerCase().startsWith("image/png")) {
								recognized = true;
								handleImage(usersEmail, "image/png",subPart.getFileName(), message.getSubject(), subPart.getInputStream());
							}
						}
					}
				}
			} else {
				log.info("Content: " + content);
			}
		} catch (MessagingException e) {
			log.error("Error while checking email",e);
		} catch (IOException e) {
			log.error("Error while checking email",e);
		} finally {
			if (!recognized) {
				surveillanceService.logInfo("The email was not recognized", subject);
			}
		}

	}

	private void handleImage(String usersEmail, String mimeType, String fileName, String subject, InputStream inputStream) {
		log.info("Image from: " + usersEmail + " of type: " + mimeType + "...");
		FileOutputStream output = null;
		try {
			User admin = modelService.getUser(SecurityService.ADMIN_USERNAME);
			User user = memberService.getUserByPrimaryEmail(usersEmail, admin);
			if (user!=null) {
				File tempFile = File.createTempFile(usersEmail, null);
				tempFile.deleteOnExit();
				output = new FileOutputStream(tempFile);
				log.info("Transfering image from e-mail");
				IOUtils.copy(inputStream, output);
				log.info("Creating image from file");
				String title;
				if (Strings.isNotBlank(subject)) {
					title = subject;
				} else {
					title = fileService.cleanFileName(fileName);
				}
				Image image = imageService.createImageFromFile(tempFile, title, user);
				surveillanceService.logInfo("Created image "+image.getName()+" for the user "+user.getUsername(), "Image-ID: "+image.getId());
			} else {
				surveillanceService.logInfo("Ignoring email since no user found", "Email: "+usersEmail);
				log.warn("No user found with email:"+usersEmail); 
			}
		} catch (IOException e) {
			log.error("Unable to get stream");
		} catch (ModelException e) {
			log.error("Unable to create image", e);
		} finally {
			IOUtils.closeQuietly(output);
			IOUtils.closeQuietly(inputStream);
		}
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setImageService(ImageService imageService) {
		this.imageService = imageService;
	}
	
	public void setMemberService(MemberService memberService) {
		this.memberService = memberService;
	}
	
	public void setFileService(FileService fileService) {
		this.fileService = fileService;
	}
	
	public void setSurveillanceService(SurveillanceService surveillanceService) {
		this.surveillanceService = surveillanceService;
	}
}
