package dk.in2isoft.onlineobjects.apps.desktop;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Relation;

public class EntityWindow extends Window {
	private static Logger log = Logger.getLogger(EntityWindow.class);

	private Entity entity;
	
	public EntityWindow(Entity entity) {
		this.entity = entity;
	}

	@Override
	public String getBody() {
		StringBuilder html = new StringBuilder();
		if (entity instanceof Person) {
			Person p = (Person) entity;
			html.append("<dl>"+
			"<dt>First name:</dt><dd>"+p.getGivenName()+"</dd>"+
			"<dt>Last name:</dt><dd>"+p.getFamilyName()+"</dd>"+
			"</dl><ul>");
			try {
				List<Relation> subRelations = Core.getInstance().getModel().getRelationsFrom(p);
				for (Iterator<Relation> iter = subRelations.iterator(); iter.hasNext();) {
					Relation element = iter.next();
					html.append("<li>"+element.getTo().getClass().getCanonicalName()+"</li>");
				}
			} catch (Exception e) {
				log.error(e.getMessage(), e);
			}
			html.append("</ul>");
		} else {
			html.append("<div>"+entity.getName()+"</div>");
		}
		return html.toString();
	}

	public List<WindowProperty> getProperties() {
		List<WindowProperty> props = new ArrayList<WindowProperty>();
		if (entity instanceof Person) {
			Person p = (Person) entity;
			props.add(new WindowProperty("Name",p.getName()));
		} else {
			props.add(new WindowProperty("Name",entity.getName()));
		}
		try {
			List<Relation> subRelations = Core.getInstance().getModel().getRelationsFrom(entity);
			for (Iterator<Relation> iter = subRelations.iterator(); iter.hasNext();) {
				Relation element = iter.next();
				WindowProperty prop = new WindowProperty(getBadge(element.getTo()),element.getTo().getName());
				prop.setEntityId(element.getTo().getId());
				props.add(prop);
			}
			List<Relation> superRelations = Core.getInstance().getModel().getRelationsTo(entity);
			for (Iterator<Relation> iter = superRelations.iterator(); iter.hasNext();) {
				Relation element = iter.next();
				WindowProperty prop = new WindowProperty(getBadge(element.getFrom()),element.getFrom().getName());
				prop.setEntityId(element.getFrom().getId());
				props.add(prop);
			}
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
		return props;
	}
	
	private String getBadge(Entity entity) {
		if (entity.getType().equals("Entity/EmailAddress")) {
			return "Email";
		} else if (entity.getType().equals("Entity/PhoneNumber")) {
			return "Phone";
		} else if (entity.getType().equals("Entity/Person")) {
			return "Person";
		} else {
			return entity.getType();
		}
	}
}
