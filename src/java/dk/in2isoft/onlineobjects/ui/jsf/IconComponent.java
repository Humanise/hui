package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ClassBuilder;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.onlineobjects.ui.Icons;

@FacesComponent(value=IconComponent.FAMILY)
public class IconComponent extends AbstractComponent {


	public static final String FAMILY = "onlineobjects.icon";
	private String icon;
	private String styleClass;
	private int size = 16;
	
	public IconComponent() {
		super(FAMILY);
	}

	@Override
	public void restoreState(Object[] state) {
		icon = (String) state[0];
		styleClass = (String) state[1];
		size = (Integer) state[2];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {icon,styleClass,size};
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String var) {
		this.icon = var;
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		
		writer.startSpan().withClass(new ClassBuilder("oo_icon").add("oo_icon", size).add(styleClass).add("oo_icon", icon));
		writer.endSpan();
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
}
