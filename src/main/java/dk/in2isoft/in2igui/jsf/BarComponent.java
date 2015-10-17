package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.StyleBuilder;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=BarComponent.TYPE)
@Dependencies(
		js = {"/hui/js/Bar.js"},
		css = {"/hui/css/bar.css"},
		requires = {HUIComponent.class}
	)
public class BarComponent extends AbstractComponent {

	public static final String TYPE = "hui.bar";

	private String variant;
	private String name;
	private int contentWidth;

	public BarComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		variant = (String) state[0];
		name = (String) state[1];
		contentWidth = (Integer) state[2];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
			variant,name,contentWidth
		};
	}
	
	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		out.startDiv(variant!=null ? "hui_bar hui_bar_"+variant : "hui_bar");
		out.startDiv("hui_bar_body");
		if (contentWidth>0) {
			out.withStyle(new StyleBuilder().withWidth(contentWidth).withMargin("0 auto"));
		}
		UIComponent right = getFacet("right");
		if (right!=null) {
			out.startDiv("hui_bar_right");
			right.encodeAll(context);
			out.endDiv();
		}
		out.startDiv("hui_bar_left");
	}
	
	@Override
	protected void encodeEnd(FacesContext context, TagWriter writer) throws IOException {
		writer.endDiv().endDiv().endDiv();
	}

	public void setText(String text) {
		this.variant = text;
	}

	public String getText() {
		return variant;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setContentWidth(int contentWidth) {
		this.contentWidth = contentWidth;
	}

	public int getContentWidth() {
		return contentWidth;
	}

	public void setVariant(String variant) {
		this.variant = variant;
	}

	public String getVariant() {
		return variant;
	}
}
