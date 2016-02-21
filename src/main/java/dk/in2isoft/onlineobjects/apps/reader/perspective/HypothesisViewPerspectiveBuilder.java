package dk.in2isoft.onlineobjects.apps.reader.perspective;

import java.util.List;

import org.eclipse.jdt.annotation.Nullable;

import dk.in2isoft.commons.lang.HTMLWriter;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Hypothesis;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.Statement;

public class HypothesisViewPerspectiveBuilder extends EntityViewPerspectiveBuilder {


	public HypothesisViewPerspective build(long id, UserSession session) throws ModelException, ContentNotFoundException {
		@Nullable
		Hypothesis question = modelService.get(Hypothesis.class, id, session);
		if (question == null) {
			throw new ContentNotFoundException(Hypothesis.class, id);
		}
		HypothesisViewPerspective perspective = new HypothesisViewPerspective();
		perspective.setId(id);
		perspective.setText(question.getText());

		readerModelService.categorize(question, perspective, session);

		List<Statement> supports = modelService.getParents(question, Relation.SUPPORTS, Statement.class, session);
		List<Statement> contradicts = modelService.getParents(question, Relation.CONTRADTICS, Statement.class, session);

		HTMLWriter html = new HTMLWriter();

		writeList(html, "Supporting", supports, session);

		writeList(html, "Contradicting", contradicts, session);
		
		perspective.setRendering(html.toString());
		return perspective;
	}
}
