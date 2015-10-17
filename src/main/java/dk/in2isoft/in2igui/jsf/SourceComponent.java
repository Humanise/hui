package dk.in2isoft.in2igui.jsf;

import java.io.IOException;
import java.util.List;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.ScriptWriter;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=SourceComponent.TYPE)
@Dependencies(js = { "/hui/js/Source.js" }, requires = {HUIComponent.class})
public class SourceComponent extends AbstractComponent {

	public static final String TYPE = "hui.source";

	private String name;
	private String url;
	private Integer delay;
	private boolean lazy;

	public SourceComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
		url = (String) state[1];
		lazy = (Boolean) state[2];
		delay = (Integer) state[3];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { name, url, lazy, delay };
	}

	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		ScriptWriter js = out.getScriptWriter().startScript();
		
		js.startNewObject("hui.ui.Source").property("name", name).comma().property("lazy", lazy);
		js.comma().property("url", getUrl(context));
		js.comma().propertyRaw("parameters", buildParameters());
		if (delay!=null) {
			js.comma().property("delay", delay);
		}
		js.endNewObject().endScript();
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
				sb.append("{key:'").append(parameter.getKey()).append("',value:'").append(parameter.getValue()).append("',separate:true").append("}");
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

	public boolean isLazy() {
		return lazy;
	}

	public void setLazy(boolean lazy) {
		this.lazy = lazy;
	}
	
	public void setDelay(Integer delay) {
		this.delay = delay;
	}
	
	public Integer getDelay() {
		return delay;
	}
}
