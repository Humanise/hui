package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.File;
import java.io.IOException;
import java.util.Map;

import javax.faces.component.FacesComponent;
import javax.faces.component.html.HtmlBody;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.DependencyGraph;
import dk.in2isoft.commons.jsf.ScriptWriter;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.commons.lang.Files;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.ui.DependencyService;

@FacesComponent(BodyComponent.TYPE)
@Dependencies(css={"/WEB-INF/core/web/css/oo_body.css"},requires={OnlineObjectsComponent.class})
public class BodyComponent extends HtmlBody {

	public static final String TYPE = "onlineobjects.body";
	
	private boolean plain;
	
	public java.lang.String getStyleClass() {
		if (plain) {
			return null;
		}
		String styleClass = super.getStyleClass();
		Map<String, String> map = getFacesContext().getExternalContext().getRequestHeaderMap();
		String cls = "oo";
		if (map.containsKey("User-Agent")) {
			String agent = map.get("User-Agent");
			if (!agent.contains("Opera")) {
				if (agent.contains("MSIE 6")) {
					cls+= " oo_msie oo_msie6";
				} else if (agent.contains("MSIE 7")) {
					cls+= " oo_msie oo_msie7";
				} else if (agent.contains("MSIE 8")) {
					cls+= " oo_msie oo_msie8";
				} else if (agent.contains("MSIE")) {
					cls+= " oo_msie";
				}
			}
		}
		if (cls!=null && Strings.isBlank(styleClass)) {
			return cls;
		}
		if (cls!=null && Strings.isNotBlank(styleClass)) {
			return cls+" "+styleClass;
		}
		return styleClass;

    }
	
	@Override
	public void encodeEnd(FacesContext context) throws IOException {

		ConfigurationService configurationService = Components.getBean(ConfigurationService.class);
		DependencyGraph graph = Components.getDependencyGraph(context);

		TagWriter out = new TagWriter(this, context);
		ScriptWriter writer = Components.getScriptWriter(context);
		if (!configurationService.isOptimizeResources()) {

			for (String url : graph.getScripts()) {
			 	out.startScript().src(url).endScript();
			}
			File tail = configurationService.getFile(DependencyService.TAIL_PATH);
			if (tail.exists()) {
				String tailContents = Files.readString(tail);
			 	out.startScript().write(tailContents).endScript();
			}
			
		} else {
			DependencyService dependencyService = Components.getBean(DependencyService.class);
		 	
			String scriptUrl = dependencyService.handleScripts(graph);
		 	out.startScript().withAttribute("async", "async").src(scriptUrl).endScript();
		}
		String js = writer.toString();
		if (Strings.isNotBlank(js)) {
			out.startScopedScript().write("require(['all'],function() {").write(js).write("});").endScopedScript();
		}
		out.flush();
		
		super.encodeEnd(context);
	}

	public boolean isPlain() {
		return plain;
	}

	public void setPlain(boolean plain) {
		this.plain = plain;
	}
}
