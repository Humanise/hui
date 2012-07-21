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
	
	private String emptyText;
	
	public OutputComponent() {
		super(FAMILY);
	}
	
	@Override
	public Object[] saveState() {
		return new Object[] { emptyText };
	}
	
	@Override
	public void restoreState(Object[] state) {
		emptyText = (String) state[0];
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		Object value = getBinding("value");
		String text = value==null ? null : value.toString();
		if (emptyText!=null && StringUtils.isBlank(text)) {
			text = emptyText;
		}
		if (text!=null) {
			text = StringEscapeUtils.escapeXml(text);
			text = StringUtils.replace(text, "\n", "<br/>");
			writer.write(text);
		}
	}

	public void setEmptyText(String emptyText) {
		this.emptyText = emptyText;
	}

	public String getEmptyText() {
		return emptyText;
	}
}
