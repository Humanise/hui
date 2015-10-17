package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;
import java.util.List;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.StyleBuilder;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value = SplitLeftComponent.FAMILY)
@Dependencies(css={"/WEB-INF/core/web/css/oo_splitleft.css"},requires={OnlineObjectsComponent.class})
public class SplitLeftComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.splitleft";
	
	private int size;
	
	public SplitLeftComponent() {
		super(FAMILY);
	}
	
	@Override
	public void restoreState(Object[] state) {
		size = (Integer) state[0];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { size };
	}

	@Override
	protected void encodeChildren(FacesContext context, TagWriter writer) throws IOException {
		List<UIComponent> children = getChildren();
		writer.startDiv("oo_splitleft");
		writer.startDiv("oo_splitleft_left");
		children.get(0).encodeAll(context);
		writer.endDiv();
		writer.startDiv("oo_splitleft_body").withStyle(new StyleBuilder().withMarginLeft(size));
		for (int i = 1; i < children.size(); i++) {
			children.get(i).encodeAll(context);
		}
		writer.endDiv();
		writer.endDiv();
	}

	@Override
	public boolean getRendersChildren() {
		return true;
	}

	public void setSize(int size) {
		this.size = size;
	}

	public int getSize() {
		return size;
	}
}
