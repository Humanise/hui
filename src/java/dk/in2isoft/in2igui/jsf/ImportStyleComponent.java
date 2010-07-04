package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ComponentUtil;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.LifeCycleService;
import dk.in2isoft.onlineobjects.ui.Request;

@FacesComponent(value=ImportStyleComponent.TYPE)
public class ImportStyleComponent extends AbstractComponent {

	public static final String TYPE = "in2igui.importStyle";

	public ImportStyleComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
		};
	}
	
	@Override
	public String getFamily() {
		return TYPE;
	}

	@Override
	public void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		Request request = ComponentUtil.getRequest();
		LifeCycleService lifeCycleService = getBean(LifeCycleService.class);
		String stamp = "?"+lifeCycleService.getStartTime().getTime();
		ConfigurationService configurationService = getBean(ConfigurationService.class);
		boolean developmentMode = configurationService.isDevelopmentMode();
		//developmentMode = false;
		if (developmentMode) {
			writer.writeStylesheet(request.getBaseContext()+"/In2iGui/css/dev.css"+stamp).newLine();
		} else {
			writer.writeStylesheet(request.getBaseContext()+"/In2iGui/bin/minimized.css"+stamp).newLine();
		}
		
		writer.write("<!--[if lt IE 7]>").newLine();
		writer.writeStylesheet(request.getBaseContext()+"/In2iGui/css/msie6.css"+stamp).newLine();
		writer.write("<![endif]-->").newLine();
		writer.write("<!--[if IE 7]>").newLine();
		writer.writeStylesheet(request.getBaseContext()+"/In2iGui/css/msie7.css"+stamp).newLine();
		writer.write("<![endif]-->").newLine();
		writer.write("<!--[if IE 8]>").newLine();
		writer.writeStylesheet(request.getBaseContext()+"/In2iGui/css/msie8.css"+stamp).newLine();
		writer.write("<![endif]-->").newLine();
	}
}
