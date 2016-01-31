package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.ScriptWriter;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.in2igui.data.FinderConfiguration;
import dk.in2isoft.in2igui.data.FinderConfiguration.FinderListConfiguration;
import dk.in2isoft.in2igui.data.FinderConfiguration.FinderSearchConfiguration;

@FacesComponent(value = FinderComponent.TYPE)
@Dependencies(js = { "/hui/js/Finder.js" }, requires = { HUIComponent.class }, uses = {
		ListComponent.class, WindowComponent.class, ButtonComponent.class,
		SearchFieldComponent.class, SourceComponent.class,
		UploadComponent.class, StructureComponent.class, OverflowComponent.class,
		BarComponent.class, SelectionComponent.class, BoundPanelComponent.class, TextFieldComponent.class })
public class FinderComponent extends AbstractComponent {

	public static final String TYPE = "hui.finder";

	private String name;
	private String url;

	public FinderComponent() {
		super(TYPE);
	}

	@Override
	public void restoreState(Object[] state) {
		name = (String) state[0];
		url = (String) state[1];
	}

	@Override
	public Object[] saveState() {
		return new Object[] { name, url };
	}

	@Override
	public void encodeBegin(FacesContext context, TagWriter out)
			throws IOException {
		FinderConfiguration config = Components.getExpressionValue(this,
				"config", context);

		String name = getName(context);

		ScriptWriter js = out.getScriptWriter().startScript();

		js.startNewObject("hui.ui.Finder");
		js.property("name", name);
		String url = getUrl(context);
		if (isNotBlank(url)) {
			js.comma().property("url", url);
		}
		if (config != null) {
			if (isNotBlank(config.getUrl())) {
				js.comma().property("url", config.getUrl());
			}
			FinderListConfiguration list = config.getList();
			if (list != null && list.getUrl() != null) {
				js.comma().startObjectProperty("list")
						.property("url", list.getUrl()).endObjectProperty();
			}
			FinderSearchConfiguration search = config.getSearch();
			if (search != null && isNotBlank(search.getParameter())) {
				js.comma().startObjectProperty("search")
						.property("parameter", search.getParameter())
						.endObjectProperty();
			}
		}
		js.endNewObject().endScript();
	}

	public String buildConfig(FacesContext context) {
		return "{todo:true}";
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public String getName(FacesContext context) {
		return Components.getExpressionValue(this, "name", name, context);
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getUrl(FacesContext context) {
		return Components.getExpressionValue(this, "url", url, context);
	}

}
