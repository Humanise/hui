package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.ClassBuilder;
import dk.in2isoft.commons.jsf.TagWriter;

@FacesComponent(value=ArticleComponent.FAMILY)
public class ArticleComponent extends AbstractComponent {


	public static final String FAMILY = "onlineobjects.article";
	private String variant;
	private String styleClass;
	
	public ArticleComponent() {
		super(FAMILY);
	}

	@Override
	public void restoreState(Object[] state) {
		variant = (String) state[0];
		styleClass = (String) state[1];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {variant,styleClass};
	}

	public String getVariant() {
		return variant;
	}

	public void setVariant(String var) {
		this.variant = var;
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter writer) throws IOException {
		writer.startDiv(new ClassBuilder("oo_article").add("oo_article", variant).add(styleClass));
	}

	@Override
	protected void encodeEnd(FacesContext context, TagWriter writer) throws IOException {
		writer.endDiv();
	}

	public void setStyleClass(String styleClass) {
		this.styleClass = styleClass;
	}

	public String getStyleClass() {
		return styleClass;
	}
}
