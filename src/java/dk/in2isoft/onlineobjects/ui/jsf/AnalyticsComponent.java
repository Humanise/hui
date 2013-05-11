package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.onlineobjects.services.ConfigurationService;

@FacesComponent(value=AnalyticsComponent.FAMILY)
public class AnalyticsComponent extends AbstractComponent {


	public static final String FAMILY = "onlineobjects.analytics";
	
	public AnalyticsComponent() {
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
		ConfigurationService configurationService = Components.getBean(ConfigurationService.class);
		String code = configurationService.getAnalyticsCode();
		if (StringUtils.isNotBlank(code)) {
			out.startScript();
			out.write("try {").line();
			out.write("var _gaq=[['_setAccount','").write(code).write("'],['_trackPageview']];").line();
			out.write("(function() {").line();
			out.write("var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;").line();
			out.write("ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';").line();
			out.write("var s = document.getElementsByTagName('script')[0];").line();
			out.write("s.parentNode.insertBefore(ga, s);").line();
			out.write("})();").line();
			out.write("} catch(ex) {}").line();
			out.endScript();
		}
	}
}
