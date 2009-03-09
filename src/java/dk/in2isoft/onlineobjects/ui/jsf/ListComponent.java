package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.el.ValueExpression;
import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponent;
import javax.faces.component.UIComponentBase;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;
import javax.faces.render.Renderer;

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
		Object[] state = new Object[] {
			super.saveState(context),var,gallery,paging
		};
		return state;
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
		ResponseWriter writer = context.getResponseWriter();
		ListModel<T> model = getModel();
		if (model==null) {
			writer.write("NO MODEL!!");
			return;
		}
		decodeRequest(context, model);
		ListModelResult<T> result = model.getResult();
		writer.startElement("div", this);
		writer.writeAttribute("class","oo_list", null);
		if (isPaging()) {
			encodePaging(writer, result.getTotalCount(), model.getPage(), model.getPageSize());
		}
		writer.startElement("ol", this);
		if (gallery) {
			writer.writeAttribute("class","oo_gallery", null);
		} else {
			writer.writeAttribute("class","oo_list_result", null);
		}
		List<UIComponent> children = getChildren();
		for (T object : result.getList()) {
			writer.startElement("li", this);
			writer.writeAttribute("class","oo_list_item", null);
			context.getExternalContext().getRequestMap().put(var, object);
			for (UIComponent child : children) {
				child.encodeAll(context);
			}
			writer.endElement("li");
		}
		writer.endElement("ol");
		writer.endElement("div");
	}
	
	private void encodePaging(ResponseWriter writer, int totalCount, int page, int pageSize) throws IOException {
		int pages = (int) Math.ceil((double)totalCount/(double)pageSize);
		if (pages<2) return;
		writer.startElement("div", this);
		writer.writeAttribute("class", "oo_list_navigator", null);
		for (int i = 0; i < pages; i++) {
			writer.startElement("a", this);
			writer.writeAttribute("href", "?page="+(i+1), null);
			if (page==i) {
				writer.writeAttribute("class", "oo_selected", null);
			}
			writer.write(String.valueOf(i+1));
			writer.endElement("a");
		}
		writer.endElement("div");
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
