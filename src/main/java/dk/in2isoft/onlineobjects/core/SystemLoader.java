package dk.in2isoft.onlineobjects.core;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.core.exceptions.ConfigurationException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;

public class SystemLoader implements ServletContextListener {

	private static Logger log = Logger.getLogger(SystemLoader.class);

	public void contextDestroyed(ServletContextEvent event) {
	}

	public void contextInitialized(ServletContextEvent event) {
		ServletContext context = event.getServletContext();
        String basePath = context.getRealPath("/");
        log.info("OnlineObjects - ready for takeoff");
        try {
			Core.getInstance().start(basePath,context);
		} catch (ConfigurationException e) {
			log.error(e.getMessage(),e);
		} catch (ModelException e) {
			log.error(e.getMessage(),e);
		} catch (SecurityException e) {
			log.error(e.getMessage(),e);
		}
		
	}
}
