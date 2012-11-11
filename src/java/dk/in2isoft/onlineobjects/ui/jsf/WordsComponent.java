package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;
import java.util.List;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.onlineobjects.model.Word;

@FacesComponent(value=WordsComponent.FAMILY)
public class WordsComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.words";
	
	private boolean editable;
	
	public WordsComponent() {
		super(FAMILY);
	}

	@Override
	public void restoreState(Object[] state) {
		editable = (Boolean) state[0];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {editable};
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		List<Word> words = getExpression("words", context);
		boolean editable = isEditable(context);
		String id = getClientId();
		
		out.startP("oo_words").withId(id);
		for (Word word : words) {
			out.startSpan().withAttribute("data", word.getId()).text(word.getText()).endSpan().text(" ");
		}
		if (editable) {
			out.startVoidA("oo_words_add").text("Add word").endA();
		}
		out.endP();
		if (editable) {
			out.startScript();
			out.startNewObject("oo.Words").property("element", id);
			out.endNewObject();
			out.endScript();
		}
	}

	public void setEditable(boolean editable) {
		this.editable = editable;
	}

	public boolean isEditable() {
		return editable;
	}

	public boolean isEditable(FacesContext context) {
		return getExpression("editable", editable, context);
	}
}
