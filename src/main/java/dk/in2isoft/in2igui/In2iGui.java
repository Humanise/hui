package dk.in2isoft.in2igui;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintStream;
import java.io.StringReader;
import java.util.NoSuchElementException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.transform.Templates;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.TransformerFactoryConfigurationError;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.commons.pool.ObjectPool;
import org.apache.commons.pool.PoolableObjectFactory;
import org.apache.commons.pool.impl.StackObjectPool;
import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.services.ConfigurationService;

public class In2iGui {

	private static Logger log = Logger.getLogger(In2iGui.class);

	private static In2iGui instance;

	private String path = "";
	private boolean developmentMode;
	private ObjectPool<Transformer> pool;

	private Templates templates;

	private In2iGui() {
		super();
		ConfigurationService config = Core.getInstance().getConfigurationService();
		developmentMode = config.isDevelopmentMode();
		path = config.getFile("hui").getAbsolutePath();
		pool = new StackObjectPool<Transformer>(new PoolableObjectFactory<Transformer>() {

			public void activateObject(Transformer arg0) throws Exception {
			}

			public void destroyObject(Transformer arg0) throws Exception {
			}

			public Transformer makeObject() throws Exception {
				return createTransformer(false);
			}

			public void passivateObject(Transformer arg0) throws Exception {
			}

			public boolean validateObject(Transformer arg0) {
				return true;
			}
			
		});
	}

	public static synchronized In2iGui getInstance() {
		if (instance == null) {
			instance = new In2iGui();
		}
		return instance;
	}
	
	public String getPath() {
		return path;
	}

	private void render(StreamSource source, OutputStream output, String context,boolean devMode) throws IOException {
		Transformer transformer = null;;
		try {
			if (devMode) {
				transformer = createTransformer(true);
			} else {
				transformer = (Transformer) pool.borrowObject();
			}
			transformer.setParameter("context", context);
			transformer.setParameter("dev", devMode);
			transformer.setParameter("version", "x");
			transformer.setParameter("profile", "false");
			transformer.setParameter("language", "da");
			transformer.setParameter("pathVersion", "");
			transformer.transform(source, new StreamResult(output));
		} catch (TransformerFactoryConfigurationError e) {
			e.printStackTrace(new PrintStream(output));
		} catch (TransformerConfigurationException e) {
			e.printStackTrace(new PrintStream(output));
		} catch (TransformerException e) {
			try {
				new OutputStreamWriter(output).write("<?xml version=\"1.0\"?><error><message>" + e.getMessage()
						+ "</message></error>");
			} catch (IOException ex) {
				log.error(ex.getMessage(), ex);
			}
		} catch (NoSuchElementException e) {
			e.printStackTrace();
		} catch (IllegalStateException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (!devMode && transformer!=null) {
				try {
					pool.returnObject(transformer);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	private void setHeaders(HttpServletRequest request, HttpServletResponse response) {
		String accept = request.getHeader("Accept");
		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
	}

	public void render(String xmlData, HttpServletRequest request,HttpServletResponse response) throws IOException {
		setHeaders(request, response);
		OutputStream stream = response.getOutputStream();
		try {
			boolean devMode = developmentMode;
			if (!xmlData.startsWith("<?xml")) {
				xmlData="<?xml version=\"1.0\"?>"+xmlData;
			}
			StringReader xmlReader = new StringReader(xmlData);
			if ("false".equals(request.getParameter("dev"))) {
				devMode=false;
			} else if ("true".equals(request.getParameter("dev"))) {
				devMode=true;
			}
			render(new StreamSource(xmlReader), stream, request.getContextPath(),devMode);
		} catch (TransformerFactoryConfigurationError e) {
			e.printStackTrace(new PrintStream(stream));
		}
	}

	public void render(File file, HttpServletRequest request,HttpServletResponse response) throws IOException {
		setHeaders(request, response);
		OutputStream stream = response.getOutputStream();
		try {
			boolean devMode = developmentMode;
			if ("true".equals(request.getParameter("nodev"))) {
				devMode=false;
			}
			render(new StreamSource(file), stream, request.getContextPath(),devMode);
		} catch (TransformerFactoryConfigurationError e) {
			e.printStackTrace(new PrintStream(stream));
		}
	}

	private Transformer createTransformer(boolean newTemplates) throws TransformerFactoryConfigurationError, TransformerConfigurationException {
		if (templates == null || newTemplates) {
			StringBuilder xslString = new StringBuilder();
			xslString.append("<?xml version='1.0' encoding='UTF-8'?>").append(
					"<xsl:stylesheet xmlns:xsl='http://www.w3.org/1999/XSL/Transform' version='1.0'>").append(
					"<xsl:output method='xml' indent='no' encoding='UTF-8'/>").append(
					"<xsl:param name='dev'/><xsl:param name='version'/><xsl:param name='context'/><xsl:param name='profile'/><xsl:param name='language'/><xsl:param name='pathVersion'/>").append(
					"<xsl:include href='").append(path).append("/xslt/gui.xsl'/>").append(
					"<xsl:template match='/'><xsl:apply-templates/></xsl:template>").append("</xsl:stylesheet>");
			StringReader xslReader = new StringReader(xslString.toString());
			TransformerFactory factory = TransformerFactory.newInstance();
			templates = factory.newTemplates(new StreamSource(xslReader));
		}
		return templates.newTransformer();
	}
}
