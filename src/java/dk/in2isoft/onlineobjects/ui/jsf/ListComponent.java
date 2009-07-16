package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.el.ValueExpression;
import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponent;
import javax.faces.component.UIComponentBase;
import javax.faces.context.FacesContext;
import javax.faces.render.Renderer;

import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value="onlineobjects.list")
public class ListComponent <T> extends UIComponentBase {

	private static final String FAMILY = "onlineobjects.list";
	private String var;
	private boolean gallery;
	private boolean paging = true;
	
	@Override
	public void restoreState(FacesContext context, Object state) {
		Object[] stt = (Object[]) state;
		super.restoreState(context, stt[0]);
		var = (String) stt[1];
		gallery = (Boolean) stt[2];
		paging = (Boolean) stt[3];
	}

	@Override
	public Object saveState(FacesContext context) {
		return new Object[] {
			super.saveState(context),var,gallery,paging
		};
	}

	@Override
	public String getFamily() {
		return FAMILY;
	}

	public String getVar() {
		return var;
	}

	public void setVar(String var) {
		this.var = var;
	}

	public void setGallery(boolean gallery) {
		this.gallery = gallery;
	}

	public boolean isGallery() {
		return gallery;
	}

	public void setPaging(boolean paging) {
		this.paging = paging;
	}

	public boolean isPaging() {
		return paging;
	}

	@Override
	public void encodeBegin(FacesContext context) throws IOException {
	}
	
	@Override
	protected Renderer getRenderer(FacesContext context) {
		return null;
	}

	@Override
	public boolean getRendersChildren() {
		return true;
	}

	@SuppressWarnings("unchecked")
	private ListModel<T> getModel() {
		ValueExpression expression = getValueExpression("model");
		Object value = expression.getValue(getFacesContext().getELContext());
		return (ListModel<T>) value;
	}
	
	@Override
	public void encodeChildren(FacesContext context) throws IOException {
		TagWriter writer = new TagWriter(this, context);
		ListModel<T> model = getModel();
		if (model==null) {
			writer.write("NO MODEL!!");
			return;
		}
		decodeRequest(context, model);
		ListModelResult<T> result = model.getResult();
		writer.startDiv("oo_list");
		if (isPaging()) {
			encodePaging(writer, result.getTotalCount(), model.getPage(), model.getPageSize());
		}
		writer.startOl(gallery ? "oo_list_gallery" : "oo_list_result");
		List<UIComponent> children = getChildren();
		for (T object : result.getList()) {
			writer.startLi("oo_list_item");
			context.getExternalContext().getRequestMap().put(var, object);
			for (UIComponent child : children) {
				child.encodeAll(context);
			}
			writer.endLi();
		}
		writer.endOl();
		writer.endDiv();
	}
	
	private void encodePaging(TagWriter writer, int totalCount, int page, int pageSize) throws IOException {
		int pages = (int) Math.ceil((double)totalCount/(double)pageSize);
		writer.startDiv("oo_list_navigator");
		if (pages>1) {
			writer.startSpan("oo_list_pages");
			for (int i = 0; i < pages; i++) {
				writer.startA().withHref("?page="+(i+1));
				if (page==i) {
					writer.withClass("oo_selected");
				}
				writer.write(String.valueOf(i+1));
				writer.endA();
			}
			writer.endSpan();
		}
		if (gallery) {
			writer.startVoidA("oo_list_slideshow").startSpan().write("Lysbillede-show").endSpan().endA();
		}
		writer.endDiv();
	}

	@Override
	public void encodeEnd(FacesContext context) throws IOException {
	}

	private void decodeRequest(FacesContext context, ListModel<T> model) {
		Map<String, String> map = context.getExternalContext().getRequestParameterMap();
		if (map.containsKey("page")) {
			try {
				int page = Integer.parseInt(map.get("page"));
				model.setPage(page-1);
			} catch (NumberFormatException ignore) {}
		}
	}
}
