package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ClassBuilder;
import dk.in2isoft.commons.jsf.ComponentUtil;
import dk.in2isoft.commons.jsf.StyleBuilder;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=ButtonComponent.TYPE)
public class ButtonComponent extends AbstractComponent {

	public static final String TYPE = "hui.button";

	private String text;
	private String name;
	private boolean highlighted;
	private boolean small;
	private boolean mini;
	private boolean tiny;
	private String click;
	private boolean submit;
	private String styleClass;
	private String variant;
	private Integer left;
	private Integer right;

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
		variant = (String) state[7];
		left = (Integer) state[8];
		right = (Integer) state[9];
		mini = (Boolean) state[10];
		tiny = (Boolean) state[11];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
			text,name,highlighted,small,click,styleClass,submit,variant,left,right,mini,tiny
		};
	}
	
	@Override
	public void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		String id = getClientId();
		ClassBuilder cls = new ClassBuilder("hui_button").add(styleClass).add("hui_button", variant);
		if (small) {
			cls.add("hui_button_small").add("hui_button_small", variant);
			if (highlighted) {
				cls.add("hui_button_small_highlighted");
			}
		} else if (mini) {
			cls.add("hui_button_mini").add("hui_button_mini", variant);
			if (highlighted) {
				cls.add("hui_button_mini_highlighted");
			}
		} else if (tiny) {
			cls.add("hui_button_tiny").add("hui_button_tiny", variant);
			if (highlighted) {
				cls.add("hui_button_tiny_highlighted");
			}
		} else {
			if (highlighted) {
				cls.add("hui_button_highlighted").add("hui_button_highlighted", variant);
			}
		}
		if (isNotBlank(styleClass)) {
			writer.startVoidA(styleClass);
		} else {
			writer.startVoidA(cls);
		}
		writer.withId(id);
		if (left!=null || right!=null) {
			StyleBuilder css = new StyleBuilder();
			css.withMarginLeft(left).withMarginRight(right);
			writer.withStyle(css);
		}
		String text = getText(context);
		writer.startSpan().startSpan().write(text).endSpan().endSpan();
		writer.endA();
		writer.startScopedScript();
		writer.write("var "+id+" = new hui.ui.Button({element:'").write(id).write("'");
		writer.write(",submit:"+submit);
		String name = getName(context);
		if (name!=null) {
			writer.write(",name:'"+name+"'");
		}
		if (styleClass!=null) {
			writer.write(",class:'"+styleClass+"'");
		}
		writer.write("});");
		String click = getClick(context);
		if (StringUtils.isNotBlank(click)) {
			writer.write("\n"+id+".listen({$click:function(widget) {").write(click).write("}});");
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

	public String getText(FacesContext context) {
		return ComponentUtil.getBindingAsString(this, "text", text, context);
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public String getName(FacesContext context) {
		return ComponentUtil.getBindingAsString(this, "name", name, context);
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
		return getExpression("click",click,context);
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
	
	public void setVariant(String variant) {
		this.variant = variant;
	}
	
	public String getVariant() {
		return variant;
	}

	public Integer getLeft() {
		return left;
	}

	public void setLeft(Integer left) {
		this.left = left;
	}

	public Integer getRight() {
		return right;
	}

	public void setRight(Integer right) {
		this.right = right;
	}

	public boolean isMini() {
		return mini;
	}

	public void setMini(boolean mini) {
		this.mini = mini;
	}
	
	public boolean isTiny() {
		return tiny;
	}
	
	public void setTiny(boolean tiny) {
		this.tiny = tiny;
	}
}
