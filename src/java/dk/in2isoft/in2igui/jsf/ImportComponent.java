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

@FacesComponent(value=ImportComponent.TYPE)
public class ImportComponent extends AbstractComponent {

	public static final String TYPE = "in2igui.import";
	private static final String[] LIBS = {"prototype.js","n2i.js","In2iScripts/In2iDate.js","swfupload/swfupload.js","swfobject.js"};
	private static final String[] JS = {"In2iGui.js","Toolbar.js","BoundPanel.js","Formula.js","Alert.js","Button.js","Picker.js","Editor.js","ImageViewer.js","RichText.js","Menu.js","ColorPicker.js","Overlay.js","Box.js","Upload.js","ProgressBar.js","ObjectList.js","TextField.js","SearchField.js","LocationPicker.js","Bar.js","VideoPlayer.js"};

	public ImportComponent() {
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
		if (configurationService.isDevelopmentMode()) {
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
		if (configurationService.isDevelopmentMode()) {
			for (int i = 0; i < LIBS.length; i++) {
				writer.writeScript(request.getBaseContext()+"/In2iGui/lib/"+LIBS[i]+stamp).newLine();
			}
			for (int i = 0; i < JS.length; i++) {
				writer.writeScript(request.getBaseContext()+"/In2iGui/js/"+JS[i]+stamp).newLine();
			}
		} else {
			writer.writeScript(request.getBaseContext()+"/In2iGui/bin/minimized.js"+stamp).newLine();
			
		}
		
		writer.startScript().newLine();
		writer.write("if (window['In2iGui']) {In2iGui.context = '").write(request.getBaseContext()).write("';}").newLine();
		writer.endScript().newLine();
	}
}
