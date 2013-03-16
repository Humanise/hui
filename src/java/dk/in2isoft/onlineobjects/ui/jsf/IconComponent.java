package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;
import java.util.Map;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import com.google.common.collect.Maps;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ClassBuilder;
import dk.in2isoft.commons.jsf.TagWriter;

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
		Map<String,Character> icons = Maps.newHashMap();
		icons.put("phone", 'p');
		icons.put("user", 'u');
		icons.put("globe", 'g');
		icons.put("envelope", 'e');
		icons.put("camera", 'c');
		icons.put("book", 'b');
		writer.startSpan().withClass(new ClassBuilder("oo_icon").add("oo_icon", size).add(styleClass));
		writer.text(icons.get(icon));
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
