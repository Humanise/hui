package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.File;
import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponent;
import javax.faces.component.visit.VisitResult;
import javax.faces.context.FacesContext;

import com.sun.faces.component.visit.FullVisitContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.DependencyGraph;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.commons.lang.Files;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.ui.DependencyService;
import dk.in2isoft.onlineobjects.ui.ScriptCompressor;

@FacesComponent(value = HeadComponent.FAMILY)
public class HeadComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.head";
	
	//private static final Logger log = LoggerFactory.getLogger(HeadComponent.class);

	public HeadComponent() {
		super(FAMILY);
	}

	@Override
	public void restoreState(Object[] state) {
	}

	@Override
	public Object[] saveState() {
		return new Object[] {};
	}

	@Override
	protected void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		out.startElement("head");
		out.startElement("meta").withAttribute("http-equiv", "Content-Type").withAttribute("content", "text/html; charset=utf-8").endElement("meta");
	}

	@Override
	protected void encodeEnd(FacesContext context, TagWriter out) throws IOException {
		DependencyGraph graph = Components.getDependencyGraph(context);

		context.getViewRoot().visitTree(new FullVisitContext(context), (visitContext, component) -> {
			visit(component.getClass(), component, graph, context);
			return VisitResult.ACCEPT;
		});
		ConfigurationService configurationService = getBean(ConfigurationService.class);
		
		
		if (!configurationService.isOptimizeResources()) {
			for (String url : graph.getStyles()) {
			 	out.startElement("link").rel("stylesheet").type("text/css").href(url).endElement("link");
			}
		 	writeInlineJs(configurationService, out);
		} else {
			DependencyService dependencyService = getBean(DependencyService.class);

			String styleUrl = dependencyService.handleStyles(graph);
		 	out.startElement("link").rel("stylesheet").type("text/css").href(styleUrl).endElement("link");
			
		 	writeInlineJs(configurationService, out);
		}
		out.endElement("head");
	}
	
	private void writeInlineJs(ConfigurationService configurationService, TagWriter out) throws IOException {
		File file = configurationService.getFile("WEB-INF","core","web","js","inline.js");
		if (file.exists()) {
			String contents = Files.readString(file);
			if (configurationService.isOptimizeResources()) {
				String compressed = new ScriptCompressor().compress(contents);
				out.startScript().write(compressed).endScript();
			} else {
				out.startScript().write(contents).endScript();
			}
		}
			
	}

	private void visit(Class<?> componentClass, UIComponent componentInstance, DependencyGraph graph, FacesContext context) {
		if (!graph.isVisited(componentClass)) {
			graph.markVisited(componentClass);
			Dependencies annotation = componentClass.getAnnotation(Dependencies.class);
			if (annotation != null) {
				for (Class<? extends AbstractComponent> depComponentClass : annotation.requires()) {
					visit(depComponentClass, null, graph, context);
				}

				graph.addScripts(annotation.js());
				graph.addStyles(annotation.css());

				for (Class<? extends AbstractComponent> depComponentClass : annotation.uses()) {
					visit(depComponentClass, null, graph, context);
				}
			}
		}
		if (componentInstance instanceof DependableComponent) {
			DependableComponent dep = (DependableComponent) componentInstance;
			graph.addScripts(dep.getScripts(context));
			graph.addStyles(dep.getStyles(context));
			Class<?>[] components = dep.getComponents(context);
			if (components!=null) {
				for (Class<?> cls : components) {
					visit(cls, null, graph, context);
				}
			}
		}
	}
}
