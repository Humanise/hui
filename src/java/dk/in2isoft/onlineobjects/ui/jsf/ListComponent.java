package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;
import java.util.List;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=ListComponent.FAMILY)
public class ListComponent <T> extends AbstractComponent {


	public static final String FAMILY = "onlineobjects.list";
	private String var;
	
	public ListComponent() {
		super(FAMILY);
	}

	@Override
	public void restoreState(Object[] state) {
		var = (String) state[0];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
			var
		};
	}

	public String getVar() {
		return var;
	}

	public void setVar(String var) {
		this.var = var;
	}

	@Override
	public boolean getRendersChildren() {
		return true;
	}
	
	@Override
	public void encodeChildren(FacesContext context, TagWriter writer) throws IOException {
		List<T> list = getBinding("value");
		if (list==null) {
			return;
		}
		writer.startOl("oo_list");
		List<UIComponent> children = getChildren();
		for (T object : list) {
			writer.startLi("oo_list_item");
			context.getExternalContext().getRequestMap().put(var, object);
			for (UIComponent child : children) {
				child.encodeAll(context);
			}
			writer.endLi();
		}
		writer.endOl();
	}
}
