package dk.in2isoft.onlineobjects.openoffice;

import com.sun.star.bridge.XUnoUrlResolver;
import com.sun.star.uno.*;
import com.sun.star.frame.XComponentLoader;
import com.sun.star.frame.XStorable;
import com.sun.star.util.XCloseable;
import com.sun.star.beans.PropertyValue;
import com.sun.star.beans.XPropertySet;
import com.sun.star.lang.*;

import java.io.File;
import java.lang.Exception;

import org.apache.log4j.Logger;

/** This class implements a http servlet in order to convert an incoming document
 * with help of a running OpenOffice.org and to push the converted file back
 * to the client.
 */
public class OpenOfficeConverter {

	private static Logger log = Logger.getLogger(OpenOfficeConverter.class);
	
	/** Specifies the host for the office server.
	 */
	private String stringHost = "localhost";

	/** Specifies the port for the office server.
	 */
	private String stringPort = "8100";

	/** This method converts a document to a given type by using a running
	 * OpenOffice.org and saves the converted document to the specified
	 * working directory.
	 * @param stringSourceFile The full path name of the file on the server to be converted.
	 * @param stringConvertType Type to convert to.
	 * @param stringExtension This string will be appended to the file name of the converted file.
	 * @return The full path name of the converted file will be returned.
	 * @see stringWorkingDirectory
	 */
	public void convertDocument(String stringSourceFile, String stringConvertType, String stringConvertedFile)
			throws Exception {

		XStorable xstorable = null;
		try {

			// Composing the URL
			File sfile = new File(stringSourceFile);

			//String stringUrl = "file:///" + sfile.getAbsolutePath().replaceAll("\\\\", "/");
			String stringUrl = "file:///" + sfile.getAbsolutePath();

			log.debug("Source is:"+stringUrl);
			log.debug("Target is:"+stringConvertedFile);
			
			/* Bootstraps a component context with the jurt base components
			 registered. Component context to be granted to a component for running.
			 Arbitrary values can be retrieved from the context. */
			XComponentContext xcomponentcontext = null;

			/* Gets the service manager instance to be used (or null). This method has
			 been added for convenience, because the service manager is a often used
			 object. */
			XMultiComponentFactory xmulticomponentfactory = xcomponentcontext.getServiceManager();

			/* Creates an instance of the component UnoUrlResolver which
			 supports the services specified by the factory. */
			Object objectUrlResolver = xmulticomponentfactory.createInstanceWithContext(
					"com.sun.star.bridge.UnoUrlResolver", xcomponentcontext);

			// Create a new url resolver
			XUnoUrlResolver xurlresolver = (XUnoUrlResolver) UnoRuntime.queryInterface(XUnoUrlResolver.class,
					objectUrlResolver);

			// Resolves an object that is specified as follow:
			// uno:<connection description>;<protocol description>;<initial object name>
			Object objectInitial = xurlresolver.resolve("uno:socket,host=" + stringHost + ",port=" + stringPort
					+ ";urp;StarOffice.ServiceManager");

			// Create a service manager from the initial object
			xmulticomponentfactory = (XMultiComponentFactory) UnoRuntime.queryInterface(XMultiComponentFactory.class,
					objectInitial);

			// Query for the XPropertySet interface.
			XPropertySet xpropertysetMultiComponentFactory = (XPropertySet) UnoRuntime.queryInterface(
					XPropertySet.class, xmulticomponentfactory);

			// Get the default context from the office server.
			Object objectDefaultContext = xpropertysetMultiComponentFactory.getPropertyValue("DefaultContext");

			// Query for the interface XComponentContext.
			xcomponentcontext = (XComponentContext) UnoRuntime.queryInterface(XComponentContext.class,
					objectDefaultContext);

			/* A desktop environment contains tasks with one or more
			 frames in which components can be loaded. Desktop is the
			 environment for components which can instanciate within
			 frames. */
			XComponentLoader xcomponentloader = (XComponentLoader) UnoRuntime.queryInterface(XComponentLoader.class,
					xmulticomponentfactory.createInstanceWithContext("com.sun.star.frame.Desktop", xcomponentcontext));

			// Preparing properties for loading the document
			PropertyValue propertyvalue[] = new PropertyValue[2];

			// Setting the flag for hidding the open document
			propertyvalue[0] = new PropertyValue();
			propertyvalue[0].Name = "Hidden";
			propertyvalue[0].Value = new Boolean(false);

			// Setting the flag for hidding the open document
			propertyvalue[1] = new PropertyValue();
			propertyvalue[1].Name = "UpdateDocMode";
			propertyvalue[1].Value = "1";

			// Loading the wanted document
			Object objectDocumentToStore = xcomponentloader.loadComponentFromURL(stringUrl, "_blank", 0, propertyvalue);
			if (objectDocumentToStore==null) {
				throw new Exception("Could not load document!");
			}
			// Getting an object that will offer a simple way to store a document to a URL.
			xstorable = (XStorable) UnoRuntime.queryInterface(XStorable.class, objectDocumentToStore);

			// Preparing properties for converting the document
			propertyvalue = new PropertyValue[2];
			// Setting the flag for overwriting
			propertyvalue[0] = new PropertyValue();
			propertyvalue[0].Name = "Overwrite";
			propertyvalue[0].Value = new Boolean(true);
			// Setting the filter name
			propertyvalue[1] = new PropertyValue();
			propertyvalue[1].Name = "FilterName";
			propertyvalue[1].Value = stringConvertType;
			// Storing and converting the document
			xstorable.storeToURL(stringConvertedFile, propertyvalue);
		} catch (Exception e) {
			throw e;
		} finally {
			XCloseable xcloseable = (XCloseable) UnoRuntime.queryInterface(XCloseable.class, xstorable);
			// Closing the converted document
			if (xcloseable != null)
				xcloseable.close(false);
			else {
				// If Xcloseable is not supported (older versions,
				// use dispose() for closing the document
				XComponent xComponent = (XComponent) UnoRuntime.queryInterface(XComponent.class, xstorable);
				if (xComponent!=null) {
					xComponent.dispose();
				}
			}
		}
	}
}