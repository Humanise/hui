package dk.in2isoft.onlineobjects.ui.jsf;

import java.util.Map;

import javax.faces.component.html.HtmlBody;

import dk.in2isoft.commons.lang.Strings;

public class BodyComponent extends HtmlBody {

	public java.lang.String getStyleClass() {
		String styleClass = super.getStyleClass();
		Map<String, String> map = getFacesContext().getExternalContext().getRequestHeaderMap();
		String cls = null;
		if (map.containsKey("User-Agent")) {
			String agent = map.get("User-Agent");
			if (!agent.contains("Opera")) {
				if (agent.contains("MSIE 6")) {
					cls = "oo_msie oo_msie6";
				} else if (agent.contains("MSIE 7")) {
					cls = "oo_msie oo_msie7";
				} else if (agent.contains("MSIE 8")) {
					cls = "oo_msie oo_msie8";
				} else if (agent.contains("MSIE")) {
					cls = "oo_msie";
				}
			}
		}
		if (cls!=null && Strings.isBlank(styleClass)) {
			return cls;
		}
		if (cls!=null && Strings.isNotBlank(styleClass)) {
			return cls+" "+styleClass;
		}
		return styleClass;

    }
}
