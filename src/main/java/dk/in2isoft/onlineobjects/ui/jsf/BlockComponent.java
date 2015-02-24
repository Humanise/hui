package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ClassBuilder;
import dk.in2isoft.commons.jsf.StyleBuilder;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=BlockComponent.FAMILY)
public class BlockComponent extends AbstractComponent {


	public static final String FAMILY = "onlineobjects.block";
	private String style;
	private String cssFloat;
	private Integer top;
	private Integer bottom;
	
	public BlockComponent() {
		super(FAMILY);
	}

	@Override
	public void restoreState(Object[] state) {
		style = (String) state[0];
		cssFloat = (String) state[1];
		top = (Integer) state[2];
		bottom = (Integer) state[3];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {style,cssFloat,top,bottom};
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		ClassBuilder cls = new ClassBuilder("oo_block");
		if ("right".equals(cssFloat)) {
			cls.add("oo_block_right");
		}
		writer.startDiv(cls).withId(getClientId());
		StyleBuilder css = new StyleBuilder();
		css.withPaddingTop(top);
		css.withPaddingBottom(bottom);
		css.withRule(style);
		writer.withStyle(css);
	}

	@Override
	protected void encodeEnd(FacesContext context, TagWriter writer) throws IOException {
		writer.endDiv();
	}

	public void setFloat(String cssFloat) {
		this.cssFloat = cssFloat;
	}

	public String getFloat() {
		return cssFloat;
	}

	public String getStyle() {
		return style;
	}

	public void setStyle(String var) {
		this.style = var;
	}

	public void setTop(Integer top) {
		this.top = top;
	}

	public Integer getTop() {
		return top;
	}

	public void setBottom(Integer bottom) {
		this.bottom = bottom;
	}

	public Integer getBottom() {
		return bottom;
	}
}
