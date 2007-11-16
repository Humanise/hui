package dk.in2isoft.commons.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;

import dk.in2isoft.onlineobjects.core.EndUserException;

public abstract class AbstractCommandLineInterfaceUtil {

	protected static String execute(String cmd) throws EndUserException {
		Process p;
		try {
			p = Runtime.getRuntime().exec(cmd,new String[] {"PATH=/opt/local/bin:/opt/local/sbin:/bin:/sbin:/usr/bin:/usr/local/bin:/usr/sbin"});
			checkError(p);
			return getResult(p);
		} catch (IOException e) {
			throw new EndUserException(e);
		}
	}

	private static void checkError(Process p) throws EndUserException, IOException {
		InputStream s = p.getErrorStream();
		int c;
		StringWriter sw = new StringWriter();
		while ((c = s.read()) != -1) {
			sw.write(c);
		}
		if (sw.getBuffer().length()>0) {
			throw new EndUserException(sw.toString());
		}
		
	}

	private static String getResult(Process p) throws IOException {
		InputStream s = p.getInputStream();
		int c;
		StringWriter sw = new StringWriter();
		while ((c = s.read()) != -1) {
			sw.write(c);
		}
		return sw.toString();
	}

}