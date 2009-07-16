package dk.in2isoft.onlineobjects.services;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import nu.xom.Attribute;
import nu.xom.Element;
import dk.in2isoft.commons.xml.XSLTUtil;
import dk.in2isoft.onlineobjects.core.Configuration;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.WebNode;
import dk.in2isoft.onlineobjects.model.WebPage;
import dk.in2isoft.onlineobjects.model.WebSite;
import dk.in2isoft.onlineobjects.model.util.WebModelUtil;
import dk.in2isoft.onlineobjects.publishing.Document;
import dk.in2isoft.onlineobjects.publishing.DocumentBuilder;
import dk.in2isoft.onlineobjects.publishing.FeedBuilder;
import dk.in2isoft.onlineobjects.publishing.FeedWriter;
import dk.in2isoft.onlineobjects.ui.Request;

public class PageRenderingService {

	private static String NAMESPACE = "http://uri.onlineobjects.com/publishing/WebPage/";
	
	private ModelService modelService;
	private ConversionService conversionService;

	public void render(WebPage page,Request request) throws EndUserException {
		// Get the page content
		Entity document = modelService.getChild(page, Relation.KIND_WEB_CONTENT, Entity.class);
		//ImageGallery document = (ImageGallery)model.getFirstSubRelation(page, ImageGallery.TYPE, ImageGallery.class);
		if (document==null) {
			throw new EndUserException("The page does not have a document!");
		}
		DocumentBuilder builder = DocumentBuilder.getBuilder(document.getClass());
		
		if (request.isSet("feed") && builder instanceof FeedBuilder) {
			//String format = request.getString("feed");
			FeedBuilder source = (FeedBuilder) builder;
			try {
				FeedWriter writer = new FeedWriter(request.getResponse());
				source.buildFeed((Document) document, writer);
			} catch (IOException e) {
				throw new EndUserException(e);
			}
			return;
		}
		
		// Get the website
		WebSite site = WebModelUtil.getWebSiteOfPage(page);
		// Create root
		Element root = new Element("WebPage", NAMESPACE);
		root.addAttribute(new Attribute("id",String.valueOf(page.getId())));

		Element title = new Element("title", NAMESPACE);
		title.appendChild(page.getTitle());
		
		// Append context
		Element context = new Element("context", NAMESPACE);
		context.appendChild(conversionService.generateXML(site));
		context.appendChild(conversionService.generateXML(page));
		
		WebNode node = (WebNode)modelService.getParent(page,WebNode.class);
		context.appendChild(conversionService.generateXML(node));
		
		Element nodes = new Element("nodes", NAMESPACE);
		List<WebNode> rootNodes = modelService.getChildren(site, WebNode.class);
		for (Iterator<WebNode> iter = rootNodes.iterator(); iter.hasNext();) {
			WebNode subNode = (WebNode) iter.next();
			nodes.appendChild(conversionService.generateXML(subNode));
		}
		context.appendChild(nodes);
		root.appendChild(context);
		// Append content
		Element content = new Element("content", NAMESPACE);
		content.addAttribute(new Attribute("id",String.valueOf(document.getId())));
		content.appendChild(builder.build((Document)document));
		root.appendChild(content);
		Configuration conf = Core.getInstance().getConfiguration();
		
		String template = page.getPropertyValue(WebPage.PROPERTY_TEMPLATE);
		if (template==null) template = "basic";
		
		File pageStylesheet = conf.getFile(new String[] {"WEB-INF","apps","community","xslt","page.xsl"});
		File stylesheet = conf.getFile(new String[] {"WEB-INF","apps","community","web","documents",document.getClass().getSimpleName(),"xslt","stylesheet.xsl"});
		File frame = conf.getFile(new String[] {"WEB-INF","apps","community","web","layouts","horizontal.xsl"});

		Map<String, String> parameters = buildParameters(request);
		parameters.put("privilege-document-modify", String.valueOf(Core.getInstance().getSecurityService().canModify(document, request.getSession())));
		parameters.put("page-design",template);
		try {
			if (request.getBoolean("viewsource")) {
				request.getResponse().setContentType("text/xml");
				request.getResponse().getWriter().write(root.toXML());
			} else {
				XSLTUtil.applyXSLT(root.toXML(), new File[] {pageStylesheet,stylesheet,frame}, request.getResponse(),parameters);				
			}
		} catch (IOException e) {
			throw new EndUserException(e);
		}
	}
	
	public static Map<String, String> buildParameters(Request request) {
		Configuration conf = Core.getInstance().getConfiguration();
		Map<String, String> parameters = new HashMap<String, String>();
		String devmode = String.valueOf(conf.getDevelopmentMode());
		if (request.getBoolean("nodev")) {
			devmode="false";
		}
		LifeCycleService lifeCycleService = request.getBean(LifeCycleService.class);
		parameters.put("cache-version", String.valueOf(lifeCycleService.getStartTime().getTime()));
		parameters.put("local-context", request.getLocalContextPath());
		parameters.put("base-context", request.getBaseContextPath());
		parameters.put("base-domain", request.getBaseDomain());
		parameters.put("base-domain-context", request.getBaseDomainContext());
		parameters.put("session-user-name", request.getSession().getUser().getUsername());
		parameters.put("development-mode", devmode);
		parameters.put("edit-mode",request.getBoolean("edit") ? "true" : "false");
		
		StringBuilder path = new StringBuilder();
		int level = request.getFullPath().length;
		for (int i = 0; i < level; i++) {
			path.append("../");
		}
		parameters.put("path-application", path.toString());
		parameters.put("path-core", path.toString());
		return parameters;
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public ModelService getModelService() {
		return modelService;
	}

	public void setConversionService(ConversionService conversionService) {
		this.conversionService = conversionService;
	}

	public ConversionService getConversionService() {
		return conversionService;
	}
}
