package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;
import java.util.Locale;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.ui.Request;

@FacesComponent(MetaTagsComponent.FAMILY)
public class MetaTagsComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.metatags";
		
	public MetaTagsComponent() {
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
		
		
		writer.startElement("meta").withAttribute("name", "viewport").withAttribute("content", "user-scalable=yes, width=device-width, initial-scale = 1, maximum-scale = 10, minimum-scale = 0.2").endElement("meta");
		ConfigurationService bean = getBean(ConfigurationService.class);
		Collection<Locale> locales = bean.getApplicationLocales(getRequest().getApplication());
		Request request = getRequest();
		if (locales!=null) {
			for (Iterator<Locale> i = locales.iterator(); i.hasNext();) {
				Locale locale = i.next();
				boolean selected = (locale.equals(request.getLocale()));
				if (!selected) {
					writer.startElement("link").withAttribute("rel", "alternate");
					writer.withAttribute("hreflang", locale.getLanguage());
					writer.withHref(Components.buildLanguageUrl(request, locale));
					writer.endElement("link");					
				}
			}
		}
	}

	@Override
	protected void encodeEnd(FacesContext context, TagWriter writer) throws IOException {
		
	}

}
