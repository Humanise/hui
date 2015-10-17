package dk.in2isoft.in2igui.jsf;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Components;
import dk.in2isoft.commons.jsf.Dependencies;

@FacesComponent(value=ConfirmComponent.TYPE)
@Dependencies(requires = { HUIComponent.class }, uses = { OverlayComponent.class, ButtonComponent.class })
public class ConfirmComponent extends AbstractComponent {

	public static final String TYPE = "hui.confirm";
	
	private String text;
	private String okText;
	private String cancelText;

	public ConfirmComponent() {
		super(TYPE);
	}
	
	@Override
	public void restoreState(Object[] state) {
	}

	@Override
	public Object[] saveState() {
		return new Object[] {
		};
	}
	
	@Override
	public boolean isTransient() {
		return !true;
	}

	public String getText() {
		return text;
	}

	public String getText(FacesContext context) {
		return Components.getExpressionValue(this, "text", text, context);
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getOkText() {
		return okText;
	}

	public String getOkText(FacesContext context) {
		return Components.getExpressionValue(this, "okText", okText, context);
	}

	public void setOkText(String okText) {
		this.okText = okText;
	}

	public String getCancelText() {
		return cancelText;
	}

	public String getCancelText(FacesContext context) {
		return Components.getExpressionValue(this, "cancelText", cancelText, context);
	}

	public void setCancelText(String cancelText) {
		this.cancelText = cancelText;
	}
}
