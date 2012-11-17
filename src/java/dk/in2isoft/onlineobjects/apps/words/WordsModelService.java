package dk.in2isoft.onlineobjects.apps.words;

import java.util.Collection;
import java.util.List;
import java.util.Locale;

import dk.in2isoft.in2igui.data.Diagram;
import dk.in2isoft.in2igui.data.Node;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.util.Messages;

public class WordsModelService {
	
	private ModelService modelService;

	public Diagram getDiagram(String text) throws ModelException {
		Messages msg = new Messages("classpath:dk/in2isoft/onlineobjects/apps/words/msg/Words");
		Diagram diagram = new Diagram();
		Query<Word> query = Query.of(Word.class).withField(Word.TEXT_FIELD, text);
		List<Word> words = modelService.search(query).getList();
		for (Word word : words) {
			Node wordNode = new Node();
			wordNode.setId(word.getId());
			wordNode.setTitle(word.getText());
			wordNode.addProperty("Type", "Word");
			diagram.addNode(wordNode);
			Locale locale = new Locale("en");
			
			List<Relation> childRelations = modelService.getChildRelations(word, Word.class);
			for (Relation relation : childRelations) {
				Entity child = relation.getSubEntity();
				Node childNode = new Node();
				childNode.setId(child.getId());
				childNode.setTitle(child.getName());
				childNode.addProperty("Type", "Word");
				diagram.addNode(childNode);
				diagram.addEdge(wordNode,msg.get(relation.getKind(), locale),childNode);
				
				Language language = modelService.getParent(child, Language.class);
				if (language!=null) {
					Node langNode = new Node();
					langNode.setId(language.getId());
					langNode.setTitle(language.getName());
					langNode.addProperty("Type", "Language");
					diagram.addNode(langNode);
					diagram.addEdge(childNode,langNode);
				}
			}
			
			List<Relation> parentRelations = modelService.getParentRelations(word, Word.class);
			for (Relation relation : parentRelations) {
				Entity child = relation.getSuperEntity();
				Node childNode = new Node();
				childNode.setId(child.getId());
				childNode.setTitle(child.getName());
				childNode.addProperty("Type", "Word");
				diagram.addNode(childNode);
				diagram.addEdge(wordNode,msg.get(relation.getKind(), locale),childNode);
				
				Language language = modelService.getParent(child, Language.class);
				if (language!=null) {
					Node langNode = new Node();
					langNode.setId(language.getId());
					langNode.setTitle(language.getName());
					langNode.addProperty("Type", "Language");
					diagram.addNode(langNode);
					diagram.addEdge(childNode,langNode);
				}
			}
			
			Language language = modelService.getParent(word, Language.class);
			if (language!=null) {
				Node langNode = new Node();
				langNode.setId(language.getId());
				langNode.setTitle(language.getName());
				langNode.addProperty("Type", "Language");
				diagram.addNode(langNode);
				diagram.addEdge(wordNode,langNode);
			}
			LexicalCategory category = modelService.getParent(word, LexicalCategory.class);
			if (category!=null) {
				Node categoryNode = new Node();
				categoryNode.setId(category.getId());
				categoryNode.setTitle(category.getName());
				categoryNode.addProperty("Type", "Lexical category");
				diagram.addNode(categoryNode);
				diagram.addEdge(wordNode,"Category",categoryNode);

				LexicalCategory superCategory = modelService.getParent(category, Relation.KIND_STRUCTURE_SPECIALIZATION, LexicalCategory.class);
				if (superCategory!=null) {
					Node superNode = new Node();
					superNode.setId(superCategory.getId());
					superNode.setTitle(superCategory.getName());
					superNode.addProperty("Type", "Lexical category");
					diagram.addNode(superNode);
					diagram.addEdge(superNode,"Specialization",categoryNode);
				}
			}
			User user = modelService.getChild(word, Relation.KIND_COMMON_ORIGINATOR, User.class);
			if (user!=null) {
				Node userNode = new Node();
				userNode.setId(user.getId());
				userNode.setTitle(user.getName());
				userNode.addProperty("Type", "User");
				diagram.addNode(userNode);
				diagram.addEdge(wordNode,"Originator",userNode);
			}
		}
		return diagram;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
}
