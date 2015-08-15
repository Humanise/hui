package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.LifeCycleService;
import dk.in2isoft.onlineobjects.ui.Request;

@FacesComponent(value=ImportScriptsComponent.TYPE)
public class ImportScriptsComponent extends AbstractComponent {

	public static final String TYPE = "hui.importSctipts";
	private static final String[] LIBS = {"date.js","swfupload/swfupload.js"};
	private static final String[] JS = {"hui.js","hui_require.js","hui_animation.js","hui_color.js","ui.js","DragDrop.js","Toolbar.js","BoundPanel.js","Formula.js","Alert.js","Button.js","Picker.js","Editor.js","ImageViewer.js","Menu.js","ColorPicker.js","Overlay.js","Box.js","Upload.js","ProgressBar.js","ObjectList.js","Input.js","TextField.js","SearchField.js","LocationPicker.js","Bar.js","VideoPlayer.js","Tabs.js","Flash.js","Link.js","DropDown.js","TokenField.js","DateTimeField.js","DatePicker.js","LocationField.js","Drawing.js","Finder.js","Window.js","Layout.js","Overflow.js","List.js","Selection.js","Source.js","Checkbox.js"};

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
	public void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		Request request = Components.getRequest();
		LifeCycleService lifeCycleService = getBean(LifeCycleService.class);
		String stamp = lifeCycleService!=null ? "?"+lifeCycleService.getStartTime().getTime() : "";
		ConfigurationService configurationService = getBean(ConfigurationService.class);
		boolean developmentMode = configurationService!=null ? configurationService.isDevelopmentMode() : false;
		//developmentMode = false;
		if (developmentMode) {
			for (int i = 0; i < LIBS.length; i++) {
				writer.writeScript(request.getBaseContext()+"/hui/lib/"+LIBS[i]+stamp).newLine();
			}
			for (int i = 0; i < JS.length; i++) {
				writer.writeScript(request.getBaseContext()+"/hui/js/"+JS[i]+stamp).newLine();
			}
		} else {
			writer.writeScript(request.getBaseContext()+"/hui/bin/minimized.js"+stamp).newLine();
			
		}
		
		writer.startScript().newLine();
		writer.write("hui.ui.context = '").write(request.getBaseContext()).write("';").newLine();
		writer.write("hui.ui.language = '").write(request.getLanguage()).write("';").newLine();
		writer.endScript().newLine();
	}
}
