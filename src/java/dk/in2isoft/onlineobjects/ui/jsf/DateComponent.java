package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringEscapeUtils;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value = DateComponent.FAMILY)
public class DateComponent<T> extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.date";
	
	private static Map<String,String> formats = new HashMap<String, String>();
	
	static {
		formats.put("en", "EEEE MMMM d. yyyy 'at' HH:mm:ss");
		formats.put("da", "EEEE 'd.' d. MMMM yyyy 'kl.' HH:mm:ss");
	}
	
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
			SimpleDateFormat format = new SimpleDateFormat(formats.get(getLocale().getLanguage()),getLocale());
			String str = format.format(value);
			str = StringEscapeUtils.escapeXml(str);
			writer.write(str);
		}
	}
}
