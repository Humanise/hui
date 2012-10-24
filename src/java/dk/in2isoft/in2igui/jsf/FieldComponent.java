package dk.in2isoft.in2igui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ComponentUtil;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=LinkComponent.TYPE)
public class FieldComponent extends AbstractComponent {

	public static final String TYPE = "hui.fields";
	
	private String label;

	public FieldComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
		label = (String) state[0];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
			label
		};
	}
	
	@Override
	public String getFamily() {
		return TYPE;
	}

	@Override
	public void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		
		String label = getLabel(context);
		writer.startElement("tr");
		writer.startElement("th").withClass("hui_formula_middle");
		writer.startElement("label").withClass("hui_formula_field").text(label).endElement("label");
		writer.endElement("th");
		writer.startElement("td").withClass("hui_formula_field");
	}

	@Override
	protected void encodeEnd(FacesContext context, TagWriter writer) throws IOException {
		writer.endElement("td").endElement("tr");
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}
	
	private String getLabel(FacesContext context) {
		return ComponentUtil.getBindingAsString(this, "label", label, context);
	}
}
