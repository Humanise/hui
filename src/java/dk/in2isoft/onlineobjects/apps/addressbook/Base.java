package dk.in2isoft.onlineobjects.apps.addressbook;

import java.util.List;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelFacade;
import dk.in2isoft.onlineobjects.model.EmailAddress;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.PhoneNumber;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.ui.SimpleWindow;

public class Base extends SimpleWindow {

	public Base() {
		super(new String[] { "Window", "List", "Toolbar" });
		super.title = "Address Book";
		super.icon = "Tool/AddressBook";
		super.align = ALIGN_CENTER;
		super.width = "600";
	}

	@Override
	protected void buildWindowToolbar(StringBuilder gui) throws EndUserException {
		gui.append("<toolbar xmlns='uri:Toolbar' align='center'>"
				+ "<tool title='Add person' icon='Element/Person' overlay='New' link='addPerson'/>"
				+ "<tool title='Import person' icon='Element/Person' overlay='New' link='importVCards'/>"
				+ "</toolbar>");
	}

	@Override
	protected void buildWindowContents(StringBuilder gui) throws EndUserException {
		gui.append("<list xmlns='uri:List' width='100%'>" + "<content>" + "<headergroup>" + "<header title='Name'/>"
				+ "<header title='Mail'/>" + "<header title='Phone'/>" + "</headergroup>");
		listUsers(gui);
		gui.append("</content>" + "</list>");
	}

	private void listUsers(StringBuilder gui) throws ModelException {
		ModelFacade model = Core.getInstance().getModel();
		List<Entity> result = model.listEntities(Person.class);
		for (Entity e : result) {
			List<Relation> relations = Core.getInstance().getModel().getSubRelations(e);
			gui.append("<row link='editPerson?id=" + e.getId() + "'>" + "<cell>" + "<icon icon='" + e.getIcon() + "'/>"
					+ "<text>" + escape(e.getName()) + "<break/>" + escape(e.getProperty("social.jobtitle"))
					+ "</text></cell><cell>");
			listEmails(relations, gui);
			gui.append("</cell><cell>");
			listPhones(relations, gui);
			gui.append("</cell></row>");
		}
	}

	private void listEmails(List<Relation> relations, StringBuilder gui) throws ModelException {
		int count = 0;
		for (Relation relation : relations) {
			if (relation.getSubEntity().getType().equals(EmailAddress.TYPE)) {
				if (count > 0) {
					gui.append("<break/>");
				}
				gui.append(relation.getSubEntity().getName());
				count++;
			}
		}
	}

	private void listPhones(List<Relation> relations, StringBuilder gui) throws ModelException {
		int count = 0;
		for (Relation relation : relations) {
			if (relation.getSubEntity().getType().equals(PhoneNumber.TYPE)) {
				if (count > 0) {
					gui.append("<break/>");
				}
				gui.append(relation.getSubEntity().getName());
				count++;
			}
		}
	}

}
