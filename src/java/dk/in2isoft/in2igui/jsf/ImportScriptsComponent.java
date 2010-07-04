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

@FacesComponent(value=ImportScriptsComponent.TYPE)
public class ImportScriptsComponent extends AbstractComponent {

	public static final String TYPE = "in2igui.importSctipts";
	private static final String[] LIBS = {"prototype.js","n2i.js","In2iScripts/In2iDate.js","swfupload/swfupload.js"}; //,"swfobject.js"
	private static final String[] JS = {"In2iGui.js","Toolbar.js","BoundPanel.js","Formula.js","Alert.js","Button.js","Picker.js","Editor.js","ImageViewer.js","RichText.js","Menu.js","ColorPicker.js","Overlay.js","Box.js","Upload.js","ProgressBar.js","ObjectList.js","TextField.js","SearchField.js","LocationPicker.js","Bar.js","VideoPlayer.js","Tabs.js","Flash.js","Link.js"};

	public ImportScriptsComponent() {
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
