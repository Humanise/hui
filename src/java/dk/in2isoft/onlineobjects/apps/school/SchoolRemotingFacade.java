package dk.in2isoft.onlineobjects.apps.school;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import org.apache.commons.lang.time.DateFormatUtils;

import com.google.common.collect.Lists;

import dk.in2isoft.in2igui.data.EventData;
import dk.in2isoft.in2igui.data.InfoViewData;
import dk.in2isoft.in2igui.data.ObjectData;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Event;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;

public class SchoolRemotingFacade extends AbstractRemotingFacade {

	public Collection<EventData> getEvents(Date from, Date to) throws EndUserException {
		User user = getUserSession().getUser();
		Person person = getModel().getChild(user, Relation.KIND_SYSTEM_USER_SELF, Person.class);
		if (person==null) {
			throw new EndUserException("The current user does not have a person");
		}
		
		Collection<EventData> data = Lists.newArrayList();
		Query<Event> query = Query.ofType(Event.class).withFieldValueMoreThan(Event.FIELD_STARTTIME, from).withFieldValueLessThan(Event.FIELD_ENDTIME, to).withChild(person);
		List<Event> list = getModel().search(query);
		for (Event event : list) {
			EventData eventData = new EventData();
			eventData.setId(event.getId());
			eventData.setStartTime(event.getStartTime());
			eventData.setEndTime(event.getEndTime());
			eventData.setText(event.getName());
			String location = event.getLocation();
			/*Person organizer = getModel().getFirstSubRelation(event,Relation.KIND_EVENT_ORGANIZER, Person.class);
			if (organizer!=null) {
				User orgUser = getModel().getFirstSuperRelation(organizer,Relation.KIND_SYSTEM_USER_SELF, User.class);
				if (orgUser!=null) {
					location+=" ("+orgUser.getUsername()+")";
				}
			}*/
			eventData.setLocation(location);
			
			data.add(eventData);
		}
		return data;
	}
	
	private String formatDate(Date date) {
		return DateFormatUtils.format(date, "HH:mm d. MMM yyyy", new Locale("da"));
	}
	
	public InfoViewData getEventInfo(long id) throws ModelException {
		InfoViewData data = new InfoViewData();
		Event event = getModel().get(Event.class, id);
		data.addHeader(event.getName());
		
		data.addProperty("Start:",formatDate(event.getStartTime()));
		data.addProperty("Slut:",formatDate(event.getEndTime()));
		data.addProperty("Lokation:",event.getLocation());

		List<Entity> organizers = getModel().getChildren(event, Relation.KIND_EVENT_ORGANIZER);
		data.addObjects("Underviser:", convertToObject(organizers));

		List<Entity> attendees = getModel().getChildren(event, Relation.KIND_EVENT_ATTENDEE);
		data.addObjects("Elever:", convertToObject(attendees));
		
		return data;
	}
	
	private Collection<ObjectData> convertToObject(List<Entity> entities) {
		Collection<ObjectData> objects = new ArrayList<ObjectData>();
		for (Entity entity : entities) {
			objects.add(new ObjectData(entity.getId(),entity.getName()));
		}
		return objects;
	}

	public Collection<EventData> getEntityHistory(Date from, Date to) {
		Collection<EventData> data = Lists.newArrayList();
		Query<Entity> query = new Query<Entity>(Entity.class).withCreatedFrom(from).withCreatedTo(to);
		List<Entity> list = getModel().search(query);
		for (Entity entity : list) {
			EventData event = new EventData();
			event.setStartTime(entity.getCreated());
			Calendar cal = Calendar.getInstance();
			cal.setTime(entity.getCreated());
			cal.add(Calendar.MINUTE, 30);
			event.setEndTime(cal.getTime());
			event.setText(entity.toString());
			data.add(event);
		}
		return data;
	}
	
	public boolean changeToUserOfPerson(long id) throws ModelException {
		Person person = getModel().get(Person.class, id);
		if (person!=null) {
			User user = getModel().getParent(person, Relation.KIND_SYSTEM_USER_SELF, User.class);
			if (user!=null) {
				return Core.getInstance().getSecurity().changeUser(getUserSession(), user.getUsername(), user.getPassword());
			}
		}
		return false;
	}
}
