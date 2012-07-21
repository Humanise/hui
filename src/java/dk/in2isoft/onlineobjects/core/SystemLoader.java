package dk.in2isoft.onlineobjects.core;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.log4j.Logger;

public class SystemLoader implements ServletContextListener {

	private static Logger log = Logger.getLogger(SystemLoader.class);

	public void contextDestroyed(ServletContextEvent event) {
	}

	public void contextInitialized(ServletContextEvent event) {
		// TODO Auto-generated method stub
		ServletContext context = event.getServletContext();
        String basePath=context.getRealPath("/");
        log.info("System loader is ignitet");
        log.info("The servlet-context-name is: "+context.getServletContextName());
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
