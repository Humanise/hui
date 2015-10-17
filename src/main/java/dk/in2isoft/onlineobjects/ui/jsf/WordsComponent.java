package dk.in2isoft.onlineobjects.ui.jsf;

import java.io.IOException;
import java.util.List;

import javax.faces.component.FacesComponent;
import javax.faces.context.FacesContext;

import dk.in2isoft.commons.jsf.AbstractComponent;
import dk.in2isoft.commons.jsf.Dependencies;
import dk.in2isoft.commons.jsf.ScriptWriter;
import dk.in2isoft.commons.jsf.TagWriter;
import dk.in2isoft.in2igui.jsf.OverlayComponent;
import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.util.Messages;

@FacesComponent(value=WordsComponent.FAMILY)
@Dependencies(js = { "/WEB-INF/core/web/js/oo_words.js" }, css = { "/WEB-INF/core/web/css/oo_words.css" }, requires = { OnlineObjectsComponent.class}, uses = { OverlayComponent.class })
public class WordsComponent extends AbstractComponent {

	public static final String FAMILY = "onlineobjects.words";
	
	private boolean editable;
	private String name;
	
	public WordsComponent() {
		super(FAMILY);
	}

	@Override
	public void restoreState(Object[] state) {
		editable = (Boolean) state[0];
		name = (String) state[1];
	}

	@Override
	public Object[] saveState() {
		return new Object[] {editable,name};
	}
	
	@Override
	protected void encodeBegin(FacesContext context, TagWriter out) throws IOException {
		List<Pair<Word,String>> words = getExpression("words", context);
		boolean editable = isEditable(context);
		String id = getClientId();
		out.startP("oo_words").withId(id);
		if (words!=null) {
			for (Pair<Word,String> pair : words) {
				Word word = pair.getKey();
				out.startA("oo_words_word").withHref(pair.getValue()).withAttribute("data", word.getId()).text(word.getText()).endA().text(" ");
			}
		}
		if (editable) {
			Messages msg = new Messages(getClass());
			out.startVoidA("oo_words_add").text(msg.get("add_word", getLocale())).endA();
		}
		out.endP();
		if (editable) {
			ScriptWriter js = out.getScriptWriter().startScript();
			js.startNewObject("oo.Words").property("element", id);
			if (name!=null) {
				js.comma().property("name", name);
			}
			js.endNewObject().endScript();
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
