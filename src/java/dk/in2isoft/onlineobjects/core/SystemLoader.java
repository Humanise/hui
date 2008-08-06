package dk.in2isoft.onlineobjects.core;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.apache.log4j.Logger;

public class SystemLoader extends HttpServlet {

	private static Logger log = Logger.getLogger(SystemLoader.class);
	private static final long serialVersionUID = -2383964034370210275L;
    
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        String basePath=getServletContext().getRealPath("/");
        log.info("System loader is ignitet");
        log.info("The servlet-context-name is: "+getServletContext().getServletContextName());
        try {
			Core.getInstance().start(basePath,getServletContext());
		} catch (ConfigurationException e) {
			log.error(e.getMessage(),e);
		} catch (ModelException e) {
			log.error(e.getMessage(),e);
		}
    }
}
