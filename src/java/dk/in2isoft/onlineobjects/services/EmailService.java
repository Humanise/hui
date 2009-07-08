package dk.in2isoft.onlineobjects.services;

import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.SimpleEmail;
import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.core.EndUserException;

public class EmailService {

	private static final Logger log = Logger.getLogger(EmailService.class); 
	
	private String host;
	private String username;
	private String password;
	private String defaultSenderAddress;
	private String defaultSenderName;
	
	public void sendMessage(String subject, String emailAddress) throws EndUserException {
		sendMessage(subject, null, emailAddress);
	}

	public void sendMessage(String subject, String body, String emailAddress) throws EndUserException {
		try {
			SimpleEmail email = new SimpleEmail();
			email.setHostName(host);
			email.setAuthentication(username, password);
			email.addTo(emailAddress);
			email.setFrom(defaultSenderAddress, defaultSenderName);
			email.setSubject(subject);
			email.setMsg(body);
			email.setSSL(true);
			email.setDebug(true);
			log.info("Sending email to: "+emailAddress);
			email.send();
			log.info("Sent email to: "+emailAddress);
		} catch (EmailException e) {
			log.error("Could not send email to: "+emailAddress,e);
			throw new EndUserException(e);
		}
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getUsername() {
		return username;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public String getHost() {
		return host;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPassword() {
		return password;
	}

	public void setDefaultSenderAddress(String defaultSenderAddress) {
		this.defaultSenderAddress = defaultSenderAddress;
	}

	public String getDefaultSenderAddress() {
		return defaultSenderAddress;
	}

	public void setDefaultSenderName(String defaultSenderName) {
		this.defaultSenderName = defaultSenderName;
	}

	public String getDefaultSenderName() {
		return defaultSenderName;
	}
	
}
