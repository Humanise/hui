package dk.in2isoft.in2igui.jsf;

import java.io.IOException;
import java.util.List;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=SourceComponent.TYPE)
public class SourceComponent extends AbstractComponent {

	public static final String TYPE = "hui.source";

	private String name;
	private String url;

	public SourceComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { name, url };
	}

	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		out.startScript();
		out.startNewObject("hui.ui.Source").property("name", name).comma().property("lazy", true);
		out.comma().property("url", getUrl(context));
		out.comma().propertyRaw("parameters", buildParameters());
		out.endNewObject();
		out.endScript();
	}
	
	private String buildParameters() {
		StringBuilder sb = new StringBuilder();
		sb.append("[");
		List<UIComponent> children = getChildren();
		boolean first = true;
		for (UIComponent child : children) {
			if (child instanceof ParameterComponent) {
				ParameterComponent parameter = (ParameterComponent) child;
				if (!first) {
					sb.append(",");
				}
				sb.append("{key:'").append(parameter.getKey()).append("',value:'").append(parameter.getValue()).append("'}");
				first = false;
			}
		}
		sb.append("]");
		return sb.toString();
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUrl() {
		return url;
	}

	public String getUrl(FacesContext context) {
		return getExpression("url", url, context);
	}

	public void setUrl(String url) {
		this.url = url;
	}
	
}
