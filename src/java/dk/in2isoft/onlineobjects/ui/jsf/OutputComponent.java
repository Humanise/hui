package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value = OutputComponent.FAMILY)
public class OutputComponent<T> extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.output";
	
	public OutputComponent() {
		super(FAMILY);
	}
	
	@Override
	public void restoreState(Object[] state) {
	}

	@Override
	public Object[] saveState() {
		return new Object[] { };
	}

	@Override
	public String getFamily() {
		return FAMILY;
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		Object value = getBinding("value");
		if (value!=null) {
			String str = value.toString();
			str = StringEscapeUtils.escapeXml(str);
			str = StringUtils.replace(str, "\n", "<br/>");
			writer.write(str);
		}
	}
}
