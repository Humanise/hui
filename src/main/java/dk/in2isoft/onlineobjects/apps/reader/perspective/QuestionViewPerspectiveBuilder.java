package dk.in2isoft.onlineobjects.apps.reader.perspective;

import java.util.List;

import org.eclipse.jdt.annotation.Nullable;

import dk.in2isoft.commons.lang.HTMLWriter;
import dk.in2isoft.onlineobjects.apps.reader.ReaderModelService;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Question;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.Statement;

public class QuestionViewPerspectiveBuilder extends EntityViewPerspectiveBuilder {

	private ModelService modelService;
	private ReaderModelService readerModelService;

	public QuestionViewPerspective build(long id, UserSession session) throws ModelException, ContentNotFoundException {
		@Nullable
		Question question = modelService.get(Question.class, id, session);
		if (question == null) {
			throw new ContentNotFoundException(Question.class, id);
		}
		QuestionViewPerspective perspective = new QuestionViewPerspective();
		perspective.setId(id);
		perspective.setText(question.getText());

		readerModelService.categorize(question, perspective, session);

		List<Statement> answers = modelService.getParents(question, Relation.ANSWERS, Statement.class, session);

		HTMLWriter html = new HTMLWriter();
		
		writeList(html, "Answers", answers, session);

		perspective.setRendering(html.toString());
		return perspective;
	}
}
