package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ClassBuilder;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=ButtonComponent.TYPE)
public class ButtonComponent extends AbstractComponent {

	public static final String TYPE = "in2igui.button";

	private String text;
	private String name;
	private boolean highlighted;
	private boolean small;
	private String click;
	private boolean submit;
	private String styleClass;

	public ButtonComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		text = (String) state[0];
		name = (String) state[1];
		highlighted = (Boolean) state[2];
		small = (Boolean) state[3];
		click = (String) state[4];
		styleClass = (String) state[5];
		submit = (Boolean) state[6];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
			text,name,highlighted,small,click,styleClass,submit
		};
	}
	
	@Override
	public String getFamily() {
		return TYPE;
	}

	@Override
	public void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		String id = getClientId();
		ClassBuilder cls = new ClassBuilder("in2igui_button").add(styleClass);
		if (small) {
			cls.add("in2igui_button_small_rounded");
		} else if (highlighted) {
			cls.add("in2igui_button_highlighted");
		}
		if (isNotBlank(styleClass)) {
			writer.startVoidA(styleClass);
		} else {
			writer.startVoidA(cls);
		}
		writer.withId(id);
		writer.startSpan().startSpan().write(text).endSpan().endSpan();
		writer.endA();
		writer.startScopedScript();
		writer.write("var "+id+" = new In2iGui.Button({element:'").write(id).write("'");
		writer.write(",submit:"+submit);
		if (name!=null) {
			writer.write(",name:'"+name+"'");
		}
		if (styleClass!=null) {
			writer.write(",class:'"+styleClass+"'");
		}
		writer.write("});");
		String click = getClick(context);
		if (StringUtils.isNotBlank(click)) {
			writer.write("\n"+id+".listen({$click:function() {").write(click).write("}});");
		}
		writer.endScopedScript();
	}

	public void setHighlighted(boolean highlighted) {
		this.highlighted = highlighted;
	}

	public boolean isHighlighted() {
		return highlighted;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getText() {
		return text;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setSmall(boolean small) {
		this.small = small;
	}

	public boolean isSmall() {
		return small;
	}

	public void setClick(String click) {
		this.click = click;
	}

	public String getClick() {
		return click;
	}
	
	public String getClick(FacesContext context) {
		return getBinding(click, "click");
	}

	public void setSubmit(boolean submit) {
		this.submit = submit;
	}

	public boolean isSubmit() {
		return submit;
	}

	public void setStyleClass(String styleClass) {
		this.styleClass = styleClass;
	}

	public String getStyleClass() {
		return styleClass;
	}
}
