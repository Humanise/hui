package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;
import java.util.Date;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import org.apache.commons.lang.StringEscapeUtils;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.onlineobjects.util.Dates;

@FacesComponent(value = DateComponent.FAMILY)
public class DateComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.date";
	
	private boolean weekday = true;
	private boolean time = true;
	
	public DateComponent() {
		super(FAMILY);
	}
	
	@Override
	public void restoreState(Object[] state) {
		weekday = (Boolean) state[0];
		time = (Boolean) state[1];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { weekday, time};
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		Date value = getBinding("value");
		if (value!=null) {
			String str = Dates.formatDate(value, weekday, time, getLocale());
			str = StringEscapeUtils.escapeXml(str);
			writer.write(str);
		}
	}
	
	public void setWeekday(boolean weekday) {
		this.weekday = weekday;
	}
	
	public void setTime(boolean time) {
		this.time = time;
	}
}
