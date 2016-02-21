package dk.in2isoft.onlineobjects.apps.reader;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.jdt.annotation.Nullable;

import dk.in2isoft.in2igui.data.ItemData;
import dk.in2isoft.onlineobjects.apps.reader.perspective.CategorizableViewPerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.HypothesisEditPerspective;
import dk.in2isoft.onlineobjects.apps.reader.perspective.QuestionEditPerspective;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.ContentNotFoundException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Hypothesis;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Pile;
import dk.in2isoft.onlineobjects.model.Question;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.services.PileService;

public class ReaderModelService {

	private ModelService modelService;
	private PileService pileService;

	public void categorize(Entity entity, CategorizableViewPerspective perspective, UserSession session) throws ModelException {
		Pile inbox = pileService.getOrCreatePileByRelation(session.getUser(), Relation.KIND_SYSTEM_USER_INBOX);
		Pile favorites = pileService.getOrCreatePileByRelation(session.getUser(), Relation.KIND_SYSTEM_USER_FAVORITES);

		List<Pile> piles = modelService.getParents(entity, Pile.class, session);
		for (Pile pile : piles) {
			if (pile.getId() == inbox.getId()) {
				perspective.setInbox(true);
			} else if (pile.getId() == favorites.getId()) {
				perspective.setFavorite(true);
			}
		}
	}

	public QuestionEditPerspective getQuestionEditPerspective(Long id, UserSession session) throws ModelException, ContentNotFoundException {
		@Nullable
		Question statement = modelService.get(Question.class, id, session);
		if (statement == null) {
			throw new ContentNotFoundException(Question.class, id);
		}
		QuestionEditPerspective perspective = new QuestionEditPerspective();
		perspective.setText(statement.getText());
		perspective.setId(id);
		List<Person> people = getAuthors(statement, session);
		perspective.setAuthors(buildItemData(people));
		return perspective;
	}

	public HypothesisEditPerspective getHypothesisEditPerspective(Long id, UserSession session) throws ModelException, ContentNotFoundException {
		@Nullable
		Hypothesis hypothesis = modelService.get(Hypothesis.class, id, session);
		if (hypothesis == null) {
			throw new ContentNotFoundException(Question.class, id);
		}
		HypothesisEditPerspective perspective = new HypothesisEditPerspective();
		perspective.setText(hypothesis.getText());
		perspective.setId(id);
		List<Person> people = getAuthors(hypothesis, session);
		perspective.setAuthors(buildItemData(people));
		return perspective;
	}

	private List<ItemData> buildItemData(List<Person> people) {
		return people.stream().map((Person p) -> {
			ItemData option = new ItemData();
			option.setId(p.getId());
			option.setText(p.getFullName());
			option.setIcon(p.getIcon());
			return option;
		}).collect(Collectors.toList());
	}

	public List<Person> getAuthors(Entity entity, Privileged privileged) {
		Query<Person> query = Query.of(Person.class).from(entity, Relation.KIND_COMMON_AUTHOR).withPrivileged(privileged);
		List<Person> people = modelService.list(query);
		return people;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public void setPileService(PileService pileService) {
		this.pileService = pileService;
	}
}
