package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.el.ValueExpression;
import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;
import javax.faces.render.Renderer;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.onlineobjects.model.Image;

@FacesComponent(value = NavigatorComponent.FAMILY)
@Dependencies(css={"/WEB-INF/core/web/css/oo_navigator.css"},requires={OnlineObjectsComponent.class})
public class NavigatorComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.navigator";
	private String var;

	public NavigatorComponent() {
		super(FAMILY);
	}
	
	@Override
	public void restoreState(Object[] state) {
		var = (String) state[0];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { var };
	}

	public String getVar() {
		return var;
	}

	public void setVar(String var) {
		this.var = var;
	}

	@Override
	protected Renderer getRenderer(FacesContext context) {
		return null;
	}

	@SuppressWarnings("unchecked")
	private ListModel<Image> getModel() {
		ValueExpression expression = getValueExpression("model");
		Object value = expression.getValue(getFacesContext().getELContext());
		return (ListModel<Image>) value;
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		ListModel<Image> model = getModel();
		if (model == null) {
			writer.write("NO MODEL!!");
			return;
		}
		decodeRequest(context, model);
		ListModelResult<?> result = model.getResult();
		String id = getClientId();
		writer.startDiv("oo_navigator").withId(id);
		encodePaging(writer, result.getTotalCount(), model.getPage(), model.getPageSize());
		context.getExternalContext().getRequestMap().put(var, result.getList());
	}

	@Override
	protected void encodeEnd(FacesContext context, TagWriter writer) throws IOException {
		writer.endDiv();
	}

	private void encodePaging(TagWriter writer, int totalCount, int page,
			int pageSize) throws IOException {
		if (totalCount==0) {
			return;
		}
		int pages = (int) Math.ceil((double) totalCount / (double) pageSize);
		writer.startP("oo_navigator");
		if (pages > 1) {
			writer.startSpan("oo_navigator_pages");
			for (int i = 0; i < pages; i++) {
				writer.startA().withHref("?page=" + (i + 1));
				if (page == i) {
					writer.withClass("oo_navigator_selected");
				}
				writer.startSpan().text(String.valueOf(i + 1)).endSpan();
				writer.endA();
			}
			writer.endSpan();
		}
		writer.endP();
	}

	private void decodeRequest(FacesContext context, ListModel<Image> model) {
		int page = Components.getIntParameter("page");
		if (page>0) {
			model.setPage(page - 1);
		}
	}
}
