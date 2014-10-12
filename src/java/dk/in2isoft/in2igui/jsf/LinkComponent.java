package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ClassBuilder;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=LinkComponent.TYPE)
public class LinkComponent extends AbstractComponent {

	public static final String TYPE = "hui.link";

	private String text;
	private String name;
	private String click;
	private String styleClass;

	public LinkComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		text = (String) state[0];
		name = (String) state[1];
		click = (String) state[2];
		styleClass = (String) state[3];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
			text,name,click,styleClass
		};
	}
	
	@Override
	public void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		String id = getClientId();
		ClassBuilder cls = new ClassBuilder("hui_link").add(styleClass);
		writer.startVoidA(cls);
		writer.withId(id);
		writer.startSpan().write(text);
	}
	
	@Override
	protected void encodeEnd(FacesContext context, TagWriter writer) throws IOException {
		String id = getClientId();
		writer.endA();
		writer.startScopedScript();
		writer.write("var "+id+" = new hui.ui.Link({element:'").write(id).write("'");
		if (name!=null) {
			writer.write(",name:'"+name+"'");
		}
		writer.write("});");
		String click = getClick(context);
		if (StringUtils.isNotBlank(click)) {
			writer.write("\n"+id+".listen({$click:function() {").write(click).write("}});");
		}
		writer.endScopedScript();
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
	
	public void setClass(String cls) {
		this.styleClass = cls;
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

	public void setStyleClass(String styleClass) {
		this.styleClass = styleClass;
	}

	public String getStyleClass() {
		return styleClass;
	}
}
