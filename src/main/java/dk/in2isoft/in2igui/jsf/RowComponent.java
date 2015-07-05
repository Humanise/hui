package dk.in2isoft.in2igui.jsf;

import java.io.IOException;
import java.util.Map;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import com.google.common.collect.Maps;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.commons.lang.Strings;

@FacesComponent(value=RowComponent.TYPE)
public class RowComponent extends AbstractComponent {

	public static final String TYPE = "hui.row";

	private String min;
	private String height;
	private String max;

	public RowComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		min = (String) state[0];
		height = (String) state[1];
		max = (String) state[2];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { min, height, max };
	}
	
	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		String cls = "hui_rows_row";
		Map<String,String> data = Maps.newHashMap();
		data.put("min", min);
		data.put("max", max);
		data.put("height", height);
		out.startDiv().withClass(cls).withAttribute("data", Strings.toJSON(data));
	}
	
	@Override
	protected void encodeEnd(FacesContext context, TagWriter out) throws IOException {
		out.endDiv();
	}

	public void setMin(String min) {
		this.min = min;
	}

	public String getMin() {
		return min;
	}

	public void setHeight(String height) {
		this.height = height;
	}

	public String getHeight() {
		return height;
	}

	public void setMax(String max) {
		this.max = max;
	}

	public String getMax() {
		return max;
	}
}
