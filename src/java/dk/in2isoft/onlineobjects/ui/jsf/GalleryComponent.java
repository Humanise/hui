package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;
import java.util.List;

import javax.el.ValueExpression;
import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ClassBuilder;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.ui.jsf.model.ImageContainer;
import dk.in2isoft.onlineobjects.util.Messages;

@FacesComponent(value = GalleryComponent.FAMILY)
public class GalleryComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.gallery";
	private String var;
	private String href;
	private String name;
	private boolean removable;
	private String variant;

	public GalleryComponent() {
		super(FAMILY);
	}
	
	@Override
	public void restoreState(Object[] state) {
		var = (String) state[0];
		href = (String) state[1];
		name = (String) state[2];
		removable = (Boolean) state[3];
		variant = (String) state[4];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { var, href, name, removable, variant };
	}

	@Override
	public boolean getRendersChildren() {
		return true;
	}

	@SuppressWarnings("unchecked")
	private ListModel<Image> getModel() {
		ValueExpression expression = getValueExpression("model");
		Object value = expression.getValue(getFacesContext().getELContext());
		return (ListModel<Image>) value;
	}
	 

	@Override
	public void encodeChildren(FacesContext context, TagWriter out) throws IOException {
		ListModel<Image> model = getModel();
		if (model == null) {
			out.write("NO MODEL!!");
			return;
		}
		decodeRequest(context, model);
		
		int width = 100;
		int height = 100;
		
		String href = getHref(context);
		
		ListModelResult<?> result = model.getResult();
		String id = getClientId();

		ClassBuilder cls = ClassBuilder.with("oo_gallery").add("oo_gallery",variant);
		out.startDiv(cls).withId(id);
		encodePaging(out, result.getTotalCount(), model.getPage(), model.getPageSize());
		out.startOl();
		List<UIComponent> children = getChildren();
		StringBuilder imageArray = new StringBuilder();
		imageArray.append("[");
		int num = 0;
		for (Object object : result.getList()) {
			out.startLi();
			
			
			if (getChildCount()==0 && object instanceof Image) {
				encodeImage(out, width, height, href, object, isRemovable(context));
			} else {
				context.getExternalContext().getRequestMap().put(var, object);
				for (UIComponent child : children) {
					child.encodeAll(context);
				}				
			}
			
			out.endLi();
			if (num>0) {
				imageArray.append(",");
			}
			Image image = null;
			if (object instanceof Image) {
				image = (Image) object;
			}
			if (object instanceof ImageContainer) {
				image = ((ImageContainer) object).getImage();
			}
			if (image!=null) {
				imageArray.append("{id:").append(image.getId()).append(",width:")
				.append(image.getWidth()).append(",height:")
				.append(image.getHeight()).append("}");
				num++;
			}
		}
		imageArray.append("]");
		out.endOl();
		out.endDiv();
		out.startScopedScript();
		out.startNewObject("oo.Gallery");
		if (Strings.isNotBlank(name)) {
			out.property("name", name).comma();
		}
		out.property("element", id).comma().propertyRaw("images", imageArray.toString()).comma().property("width", width).comma().property("height", height).endNewObject();
		out.endScopedScript();
	}

	private void encodeImage(TagWriter out, int width, int height, String href, Object object, boolean removable) throws IOException {
		Image image = (Image) object;
		String url = getUrl(image,width,height);
		out.startSpan("oo_gallery_photo");
		if (removable) {
			out.startSpan("oo_gallery_hover");
			out.startVoidA("oo_gallery_remove").rel("remove").data(image.getId());
			out.startSpan("oo_icon oo_icon_16").text("*").endSpan();
			out.endA();
			out.endSpan();
		}
		out.startA().withHref(getHref(href,image));
		out.startImg().src(url).alt(image.getName()).withStyle("width: "+width+"px; height: "+height+"px;").endImg();
		out.endA();
		out.endSpan();
	}

	private String getUrl(Image image, int width, int height) {
		StringBuilder url = new StringBuilder();
		url.append(Components.getRequest().getBaseContext());
		url.append("/service/image/id").append(image.getId()).append("width").append(width).append("height").append(height);
		url.append("sharpen1.0");
		url.append("cropped.jpg");
		return url.toString();
	}

	private Object getHref(String str, Image image) {
		if (str==null) {
			return null;
		}
		return str.replaceAll("\\[id\\]", String.valueOf(image.getId()));
	}

	private void encodePaging(TagWriter writer, int totalCount, int page, int pageSize) throws IOException {
		if (totalCount==0) {
			return;
		}
		//Messages msg = new Messages(this);
		int pages = (int) Math.ceil((double) totalCount / (double) pageSize);
		if (pages > 1) {
			writer.startDiv("oo_gallery_navigator");
			writer.startSpan("oo_gallery_pages");
			for (int i = 0; i < pages; i++) {
				writer.startA().withHref("?page=" + (i + 1));
				if (page == i) {
					writer.withClass("oo_selected");
				}
				writer.write(String.valueOf(i + 1));
				writer.endA();
			}
			writer.endSpan();
			writer.endDiv();
		}
		//writer.startVoidA("oo_gallery_slideshow").startSpan().write(msg.get("slideshow", getLocale())).endSpan().endA();
	}

	private void decodeRequest(FacesContext context, ListModel<Image> model) {
		int page = Components.getIntParameter("page");
		if (page>0) {
			model.setPage(page - 1);
		}
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public boolean isRemovable() {
		return removable;
	}

	public boolean isRemovable(FacesContext context) {
		return Components.getExpressionValue(this, "removable", removable, context);
	}

	public void setRemovable(boolean removable) {
		this.removable = removable;
	}

	public String getVar() {
		return var;
	}

	public void setVar(String var) {
		this.var = var;
	}
	
	public String getHref() {
		return href;
	}
	
	public String getHref(FacesContext context) {
		return Components.getExpressionValue(this, "href", href, context);
	}

	public void setHref(String href) {
		this.href = href;
	}
	
	public String getVariant() {
		return variant;
	}
	
	public void setVariant(String variant) {
		this.variant = variant;
	}
}
