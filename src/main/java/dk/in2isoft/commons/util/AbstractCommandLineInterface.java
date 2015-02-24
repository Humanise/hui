package dk.in2isoft.commons.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;

import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;

public abstract class AbstractCommandLineInterface {

	private static Logger log = Logger.getLogger(AbstractCommandLineInterface.class);
	
	protected synchronized String execute(String cmd) throws EndUserException {
		Process p;
		try {
			p = Runtime.getRuntime().exec(cmd,new String[] {"PATH=/opt/local/bin:/opt/local/sbin:/bin:/sbin:/usr/bin:/usr/local/bin:/usr/sbin"});
			checkError(p,cmd);
			return getResult(p);
		} catch (IOException e) {
			throw new EndUserException(e);
		} catch (InterruptedException e) {
			throw new EndUserException(e);
		}
	}

	private void checkError(Process p, String cmd) throws EndUserException, IOException, InterruptedException {
		InputStream s = p.getErrorStream();
		int c;
		StringWriter sw = new StringWriter();
		while ((c = s.read()) != -1) {
			sw.write(c);
		}
		if (sw.getBuffer().length()>0) {
			log.warn(sw.getBuffer().toString());
			log.warn("command: "+cmd);
			if (p.waitFor()!=0) {
				throw new EndUserException(sw.toString());				
			}
		}
		
	}

	private String getResult(Process p) throws IOException {
		InputStream s = p.getInputStream();
		int c;
		StringWriter sw = new StringWriter();
		while ((c = s.read()) != -1) {
			sw.write(c);
		}
		return sw.toString();
	}

}