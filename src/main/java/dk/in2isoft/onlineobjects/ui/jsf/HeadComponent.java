package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponent;
import javax.faces.component.visit.VisitResult;
import javax.faces.context.FacesContext;

import com.sun.faces.component.visit.FullVisitContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.DependencyGraph;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.ui.DependencyService;

@FacesComponent(value = HeadComponent.FAMILY)
public class HeadComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.head";

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
	}

	@Override
	protected void encodeEnd(FacesContext context, TagWriter out) throws IOException {
		DependencyGraph graph = new DependencyGraph();

		context.getViewRoot().visitTree(new FullVisitContext(context), (visitContext, component) -> {
			if (component instanceof AbstractComponent) {
				visit(component.getClass(), graph);
			}
			return VisitResult.ACCEPT;
		});
		ConfigurationService configurationService = getBean(ConfigurationService.class);
		
		
		if (!configurationService.isOptimizeResources()) {
			for (String url : graph.getScripts()) {
			 	out.startScript().src(url).endScript();
			}
			for (String url : graph.getStyles()) {
			 	out.startElement("link").rel("stylesheet").type("text/css").href(url).endElement("link");
			}
		} else {
			DependencyService dependencyService = getBean(DependencyService.class);
			
			String scriptUrl = dependencyService.handleScripts(graph);
		 	out.startScript().src(scriptUrl).endScript();

			String styleUrl = dependencyService.handleStyles(graph);
		 	out.startElement("link").rel("stylesheet").type("text/css").href(styleUrl).endElement("link");
		}
		out.endElement("head");
	}

	private void visit(Class<? extends UIComponent> componentClass, DependencyGraph graph) {
		if (!graph.isVisited(componentClass.getClass())) {
			Dependencies annotation = componentClass.getAnnotation(Dependencies.class);
			if (annotation != null) {
				Class<? extends AbstractComponent>[] components = annotation.components();
				if (components != null) {
					for (Class<? extends AbstractComponent> depComponentClass : components) {
						visit(depComponentClass, graph);
					}
				}
				graph.addScripts(annotation.js());
				graph.addStyles(annotation.css());
			}
			graph.markVisited(componentClass);
		}
	}
}
