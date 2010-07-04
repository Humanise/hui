package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringEscapeUtils;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value = DateComponent.FAMILY)
public class DateComponent<T> extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.date";
	
	public DateComponent() {
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
		Date value = getBinding("value");
		if (value!=null) {
			SimpleDateFormat format = new SimpleDateFormat("EEEE MMMM d. yyyy 'at' HH:mm:ss",Locale.ENGLISH);
			String str = format.format(value);
			str = StringEscapeUtils.escapeXml(str);
			writer.write(str);
		}
	}
}
