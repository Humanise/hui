package dk.in2isoft.onlineobjects.apps.reader.perspective;

import java.util.List;
import java.util.Map;

import org.eclipse.jdt.annotation.Nullable;

import com.google.common.collect.Maps;

import dk.in2isoft.commons.lang.HTMLWriter;
import dk.in2isoft.onlineobjects.apps.reader.ReaderModelService;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Question;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.Statement;

public class QuestionViewPerspectiveBuilder {

	private ModelService modelService;
	private ReaderModelService readerModelService;

	public QuestionViewPerspective build(long id, UserSession session) throws ModelException, IllegalRequestException {
		@Nullable
		Question question = modelService.get(Question.class, id, session);
		if (question == null) {
			throw new IllegalRequestException("Question not found, id=" + id);
		}
		QuestionViewPerspective perspective = new QuestionViewPerspective();
		perspective.setId(id);
		perspective.setText(question.getText());

		readerModelService.categorize(question, perspective, session);

		List<Statement> answers = modelService.getParents(question, Relation.ANSWERS, Statement.class, session);

		HTMLWriter html = new HTMLWriter();

		for (Statement statement : answers) {
			html.startDiv().withData("id", statement.getId()).withClass("reader_question_answer");
			html.startP().withClass("reader_question_answer_text").text(statement.getText());
			html.startSpan().withClass("oo_icon oo_icon_16 oo_icon_info_light js-clickable").withData("id",statement.getId(),"type",statement.getClass().getSimpleName()).endSpan();
			html.endP();
			List<Person> authors = modelService.getChildren(statement, Relation.KIND_COMMON_AUTHOR, Person.class, session);
			List<InternetAddress> addresses = modelService.getParents(statement, Relation.KIND_STRUCTURE_CONTAINS, InternetAddress.class, session);
			if (!authors.isEmpty() || !addresses.isEmpty()) {
				html.startP().withClass("reader_question_answer_info");
				boolean first = true;
				for (InternetAddress address : addresses) {
					if (!first)
						html.text(" · ");
					Map<String, Object> data = Maps.newHashMap();
					data.put("id", address.getId());
					data.put("type", address.getClass().getSimpleName());
					data.put("statementId", statement.getId());
					html.startVoidA().withClass("js-clickable reader_question_link reader_question_address").withData(data).text(address.getName()).endA();
					first = false;
				}
				for (Person person : authors) {
					if (!first)
						html.text(" · ");
					Map<String, Object> data = Maps.newHashMap();
					data.put("id", person.getId());
					data.put("type", person.getClass().getSimpleName());
					data.put("statementId", statement.getId());
					html.startVoidA().withClass("js-clickable reader_question_link reader_question_author").withData(data).text(person.getFullName()).endA();
					first = false;
				}
				html.endP();
			}
			html.endDiv();
		}
		perspective.setRendering(html.toString());
		return perspective;
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public void setReaderModelService(ReaderModelService readerModelService) {
		this.readerModelService = readerModelService;
	}
}
