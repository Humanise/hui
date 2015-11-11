package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ClassBuilder;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=IconComponent.FAMILY)
@Dependencies(css={"/WEB-INF/core/web/css/oo_icon.css","/WEB-INF/core/web/css/oo_font.css"},js={"/WEB-INF/core/web/js/oo_icon.js"},requires={OnlineObjectsComponent.class})
public class IconComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.icon";

	private String name;
	private String icon;
	private String styleClass;
	private int size = 16;
	
	public IconComponent() {
		super(FAMILY);
	}

	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
		icon = (String) state[1];
		styleClass = (String) state[2];
		size = (Integer) state[3];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {name,icon,styleClass,size};
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		boolean addController = isNotBlank(name);
		String id = getClientId();
		
		writer.startSpan().withClass(new ClassBuilder("oo_icon").add("oo_icon", size).add(styleClass).add("oo_icon", icon));
		if (addController) {
			writer.withId(id);
		}
		writer.endSpan();
		if (addController) {
			writer.getScriptWriter().startScript().startNewObject("oo.Icon").property("element", id).comma().property("name", name).endNewObject().endScript();
		}
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getName() {
		return name;
	}

	public void setStyleClass(String styleClass) {
		this.styleClass = styleClass;
	}

	public String getStyleClass() {
		return styleClass;
	}

	public int getSize() {
		return size;
	}

	public void setSize(int level) {
		this.size = level;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String var) {
		this.icon = var;
	}
}
