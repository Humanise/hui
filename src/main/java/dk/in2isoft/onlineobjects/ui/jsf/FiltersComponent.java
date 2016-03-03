package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;
import java.util.List;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ClassBuilder;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.onlineobjects.ui.jsf.model.Filters;
import dk.in2isoft.onlineobjects.ui.jsf.model.Filters.Filter;
import dk.in2isoft.onlineobjects.ui.jsf.model.Option;

@FacesComponent(value=FiltersComponent.FAMILY)
@Dependencies(js = { "/WEB-INF/core/web/js/oo_filters.js" },css={"/WEB-INF/core/web/css/oo_filters.css"})
public class FiltersComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.filters";
	private String variant;
	private String styleClass;

	public FiltersComponent() {
		super(FAMILY);
	}
	
	@Override
	public void restoreState(Object[] state) {
		variant = (String) state[0];
		styleClass = (String) state[1];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {variant, styleClass};
	}

	@Override
	public void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		Filters value = Components.getExpressionValue(this, "value", context);
		boolean expanded = Components.getExpressionValue(this, "expanded", false, context);
		if (value != null) {
			List<Filter> filters = value.getFilters();
			if (!expanded) {
				out.startDiv("oo_filters_bar").withId(getClientId());
				for (int i = 0; i < filters.size(); i++) {
					Filter filter = filters.get(i);
					String cls = "oo_filters_bar_item";
					if (filter.isActive()) {
						cls += " is-active";
					}
					out.startSpan(cls).withAttribute("data-index", i).text(filter.getLabel()).endSpan();
				}
				out.endDiv();
				out.startDiv("oo_filters_body");
				for (Filter filter : filters) {
					out.startDiv("oo_filters_filter oo_filters_filter-" + filter.getVariant());
					out.startDiv("oo_filters_title oo_filters_title-" + filter.getVariant()).startSpan("oo_filters_title_text").text(filter.getTitle()).endSpan().endDiv();
					out.startDiv("oo_filters_options oo_filters_options-" + filter.getVariant());
					List<Option> options = filter.getOptions();
					for (int i = 0; i < options.size(); i++) {
						Option option = options.get(i);
						String cls = "oo_filters_option oo_filters_option-" + filter.getVariant();
						if (i == 0) {
							cls += " oo_filters_option-any";
						}
						if (option.isSelected()) {
							cls += " is-selected";
						}
						if (i>0) {
							out.text(" ");
						}
						out.startA(cls).withHref(option.getValue()).text(option.getLabel()).endA();
					}
					out.endDiv();
					out.endDiv();
				}
				out.endDiv();

				out.getScriptWriter().startScript().startNewObject("oo.Filters").property("element", getClientId()).endNewObject().endScript();

			} else {

				for (Filter filter : filters) {
					out.startDiv("oo_filters_intro oo_filters_intro-" + filter.getVariant());
					out.startDiv("oo_filters_intro_title oo_filters_intro_title-" + filter.getVariant()).startSpan("oo_filters_intro_title_text").text(filter.getTitle()).endSpan().endDiv();
					out.startDiv("oo_filters_options oo_filters_options-" + filter.getVariant());
					List<Option> options = filter.getOptions();
					for (int i = 1; i < options.size(); i++) {
						Option option = options.get(i);
						String cls = "oo_filters_intro_option oo_filters_intro_option-" + filter.getVariant();
						out.startA(cls).withHref(option.getValue()).text(option.getLabel()).endA();
						out.text(" ");
					}
					out.endDiv();
					out.endDiv();
				}
			}
		}
	}
	
	@Override
	public void encodeEnd(FacesContext context, TagWriter out) throws IOException {
	}
	
	public String getVariant() {
		return variant;
	}
	
	public void setVariant(String width) {
		this.variant = width;
	}
	
	public String getStyleClass() {
		return styleClass;
	}
	
	public void setStyleClass(String padding) {
		this.styleClass = padding;
	}
}
