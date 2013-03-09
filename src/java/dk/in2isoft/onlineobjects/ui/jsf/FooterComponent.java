package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;
import java.util.Locale;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.ui.Request;
import dk.in2isoft.onlineobjects.util.Messages;

@FacesComponent(value=FooterComponent.FAMILY)
public class FooterComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.footer";
		
	public FooterComponent() {
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
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		
		ConfigurationService bean = getBean(ConfigurationService.class);
		Collection<Locale> locales = bean.getApplicationLocales(getRequest().getApplication());
		Request request = getRequest();
		if (locales!=null) {
			Messages msg = getMessages();
			writer.startP("oo_footer");
			for (Iterator<Locale> i = locales.iterator(); i.hasNext();) {
				Locale locale = i.next();
				boolean selected = (locale.equals(request.getLocale()));
				if (selected) {
					writer.startStrong();
				} else {
					writer.startA().withHref(buildUrl(request, locale)).startSpan();
				}
				writer.text(msg.get(locale.getLanguage(), locale));
				if (selected) {
					writer.endStrong();
				} else {
					writer.endSpan().endA();
				}
				if (i.hasNext()) {
					writer.text(" \u00B7 ");
				}
			}
			writer.endP();
			writer.startP("oo_footer_logo").startSpan().write("&#xa4;").endSpan().endP();
		}
	}
	
	private String buildUrl(Request request, Locale locale) {
		String[] path = request.getLocalPath();
		StringBuilder url = new StringBuilder();
		url.append("/");
		url.append(request.getLocalContext());
		for (int i = 0; i < path.length; i++) {
			if (i==0) {
				if (path[i].length()==2) {
					url.append(locale.getLanguage());
				} else {
					url.append(path[i]);
				}
			} else {
				url.append(path[i]);
			}
			url.append("/");
		}
		return url.toString();
	}

	@Override
	protected void encodeEnd(FacesContext context, TagWriter writer) throws IOException {
		
	}

}
