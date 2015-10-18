package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.StyleBuilder;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=BoxComponent.FAMILY)
@Dependencies(css={"/WEB-INF/core/web/css/oo_box.css"})
public class BoxComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.box";
	private String width;
	private String padding;
	private String margin;

	public BoxComponent() {
		super(FAMILY);
	}
	
	@Override
	public void restoreState(Object[] state) {
		width = (String) state[0];
		padding = (String) state[1];
		margin = (String) state[2];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {width, padding, margin};
	}

	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		if (isNotBlank(margin)) {
			out.startDiv().withStyle("margin:"+toLength(margin));
		}
		out.startDiv("oo_box");
		StyleBuilder css = new StyleBuilder();
		if (isNotBlank(width)) {
			css.withWidth(toLength(width));
		}
		if (isNotBlank(padding)) {
			css.withPadding(toLength(padding));
		}
		out.withStyle(css);
	}
	
	private String toLength(String str) {
		if (isInteger(str)) {
			return str + "px";
		}
		return str;
	}

	@Override
	public void encodeEnd(FacesContext context, TagWriter out) throws IOException {
		out.endDiv();
		if (isNotBlank(margin)) {
			out.endDiv();
		}
	}
	
	public String getWidth() {
		return width;
	}
	
	public void setWidth(String width) {
		this.width = width;
	}
	
	public String getPadding() {
		return padding;
	}
	
	public void setPadding(String padding) {
		this.padding = padding;
	}
	
	public String getMargin() {
		return margin;
	}
	
	public void setMargin(String margin) {
		this.margin = margin;
	}
}
