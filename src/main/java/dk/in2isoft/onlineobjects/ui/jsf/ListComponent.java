package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;
import java.util.List;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ClassBuilder;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=ListComponent.FAMILY)
@Dependencies(css={"/WEB-INF/core/web/css/oo_list.css"},requires={OnlineObjectsComponent.class})
public class ListComponent extends AbstractComponent {


	public static final String FAMILY = "onlineobjects.list";
	private String var;
	private String variant;
	private String styleClass;
	
	public ListComponent() {
		super(FAMILY);
	}

	@Override
	public void restoreState(Object[] state) {
		var = (String) state[0];
		variant = (String) state[1];
		styleClass = (String) state[2];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {var,variant,styleClass};
	}

	public String getVar() {
		return var;
	}

	public void setVar(String var) {
		this.var = var;
	}

	@Override
	public boolean getRendersChildren() {
		return StringUtils.isNotBlank(var);
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		writer.startOl(new ClassBuilder("oo_list").add("oo_list", variant).add(styleClass));
	}

	@Override
	protected void encodeEnd(FacesContext context, TagWriter writer) throws IOException {
		writer.endOl();
	}
	
	@Override
	public void encodeChildren(FacesContext context, TagWriter writer) throws IOException {
		List<?> list = getBinding("value");
		if (list==null) {
			return;
		}
		List<UIComponent> children = getChildren();
		for (Object object : list) {
			writer.startLi("oo_list_item");
			context.getExternalContext().getRequestMap().put(var, object);
			for (UIComponent child : children) {
				child.encodeAll(context);
			}
			writer.endLi();
		}
	}

	public void setVariant(String variant) {
		this.variant = variant;
	}

	public String getVariant() {
		return variant;
	}

	public void setStyleClass(String styleClass) {
		this.styleClass = styleClass;
	}

	public String getStyleClass() {
		return styleClass;
	}
}
