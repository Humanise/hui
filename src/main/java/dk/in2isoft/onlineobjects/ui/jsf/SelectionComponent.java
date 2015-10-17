package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ClassBuilder;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.ScriptWriter;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.in2igui.jsf.SourceComponent;

@FacesComponent(value=SelectionComponent.FAMILY)
@Dependencies(css={"/WEB-INF/core/web/css/oo_selection.css"},js={"/WEB-INF/core/web/js/oo_selection.js"},requires={OnlineObjectsComponent.class})
public class SelectionComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.selection";
	private String styleClass;
	private String variant;
	private String source;
	private String name;
	private Object value;
	
	public SelectionComponent() {
		super(FAMILY);
	}

	@Override
	public void restoreState(Object[] state) {
		styleClass = (String) state[0];
		variant = (String) state[1];
		source = (String) state[2];
		name = (String) state[3];
		value = state[4];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {styleClass,variant,source,name,value};
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		out.startDiv(new ClassBuilder("oo_selection").add("oo_list", variant).add(styleClass)).withId(getClientId());
		out.startOl("oo_selection_list");
	}

	@Override
	protected void encodeEnd(FacesContext context, TagWriter out) throws IOException {
		out.endOl();
		out.endDiv();
		String sourceName = source;
		SourceComponent sourceComponent = Components.getChild(this, SourceComponent.class);
		if (sourceComponent!=null) {
			if (!Strings.isBlank(sourceComponent.getName())) {
				sourceName = sourceComponent.getName();
			}
		}
		ScriptWriter js = out.getScriptWriter();
		js.startScript();
		js.startNewObject("oo.Selection").property("element", getClientId());
		if (Strings.isNotBlank(name)) {
			js.comma().property("name", name);
		}
		if (value!=null) {
			js.comma().property("value", value.toString());
		}
		if (Strings.isNotBlank(sourceName)) {
			js.comma().property("source", sourceName);
		}
		js.endNewObject();
		js.endScript();
	}
	
	@Override
	public void encodeChildren(FacesContext context, TagWriter writer) throws IOException {
		
	}

	public void setVariant(String variant) {
		this.variant = variant;
	}

	public String getVariant() {
		return variant;
	}

	public void setStyleClass(String styleClass) {
		this.styleClass = styleClass;
	}

	public String getStyleClass() {
		return styleClass;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}
}
