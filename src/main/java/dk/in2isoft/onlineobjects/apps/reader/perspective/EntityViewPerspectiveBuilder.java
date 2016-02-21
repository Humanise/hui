package dk.in2isoft.onlineobjects.apps.reader.perspective;

import java.util.List;
import java.util.Map;

import com.google.common.collect.Maps;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.commons.lang.HTMLWriter;
import dk.in2isoft.onlineobjects.apps.reader.ReaderModelService;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.UserSession;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.Statement;

public class EntityViewPerspectiveBuilder {

	protected ModelService modelService;
	protected ReaderModelService readerModelService;

	protected void writeList(HTMLWriter html, String header, List<Statement> answers, UserSession session) throws ModelException {
		html.startDiv().withClass("reader_entity_list");
		html.startH2().withClass("reader_entity_header").text(header).endH2();
		if (Code.isEmpty(answers)) {
			html.startP().withClass("reader_entity_list_empty").text("The list is empty").endP();
		} else {
			for (Statement statement : answers) {
				html.startDiv().withData("id", statement.getId()).withClass("reader_entity_item reader_entity_item-statement");
				html.startP().withClass("reader_entity_item_text").text(statement.getText());
				html.startSpan().withClass("oo_icon oo_icon_16 oo_icon_info_light js-clickable").withDataMap("id",statement.getId(),"type",statement.getClass().getSimpleName()).endSpan();
				html.endP();
				List<Person> authors = modelService.getChildren(statement, Relation.KIND_COMMON_AUTHOR, Person.class, session);
				List<InternetAddress> addresses = modelService.getParents(statement, Relation.KIND_STRUCTURE_CONTAINS, InternetAddress.class, session);
				if (!authors.isEmpty() || !addresses.isEmpty()) {
					html.startP().withClass("reader_entity_item_info");
					boolean first = true;
					for (InternetAddress address : addresses) {
						if (!first)
							html.text(" · ");
						Map<String, Object> data = Maps.newHashMap();
						data.put("id", address.getId());
						data.put("type", address.getClass().getSimpleName());
						data.put("statementId", statement.getId());
						html.startVoidA().withClass("js-clickable reader_entity_item_link reader_entity_item_link-address").withData(data).text(address.getName()).endA();
						first = false;
					}
					for (Person person : authors) {
						if (!first)
							html.text(" · ");
						Map<String, Object> data = Maps.newHashMap();
						data.put("id", person.getId());
						data.put("type", person.getClass().getSimpleName());
						data.put("statementId", statement.getId());
						html.startVoidA().withClass("js-clickable reader_entity_item_link reader_entity_item_link-author").withData(data).text(person.getFullName()).endA();
						first = false;
					}
					html.endP();
				}
				html.endDiv();
			}
		}
		html.endDiv();
	}
	
	public final void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
	
	public final void setReaderModelService(ReaderModelService readerModelService) {
		this.readerModelService = readerModelService;
	}
}
