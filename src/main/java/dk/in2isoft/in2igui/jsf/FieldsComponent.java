package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(FieldsComponent.TYPE)
public class FieldsComponent extends AbstractComponent {

	public static final String TYPE = "hui.fields";
	
	private String labels;

	public FieldsComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		labels = (String) state[0];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
			labels
		};
	}
	
	public boolean isLabelsAbove() {
		return "above".equals(labels);
	}
	
	@Override
	public void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		if (!isLabelsAbove()) {
			writer.startElement("table").withClass("hui_formula_fields");
		}
	}
	
	@Override
	protected void encodeEnd(FacesContext context, TagWriter writer) throws IOException {
		if (!isLabelsAbove()) {
			writer.endElement("table");
		}
	}

	public String getLabels() {
		return labels;
	}

	public void setLabels(String labels) {
		this.labels = labels;
	}
}
