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
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Event;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;

public class SchoolRemotingFacade extends AbstractRemotingFacade {
	
	private SecurityService securityService;

	public Collection<EventData> getEvents(Date from, Date to) throws EndUserException {
		User user = getUserSession().getUser();
		Person person = modelService.getChild(user, Relation.KIND_SYSTEM_USER_SELF, Person.class);
		if (person==null) {
			throw new EndUserException("The current user does not have a person");
		}
		
		Collection<EventData> data = Lists.newArrayList();
		Query<Event> query = Query.of(Event.class).withFieldMoreThan(Event.FIELD_STARTTIME, from).withFieldLessThan(Event.FIELD_ENDTIME, to).withChild(person);
		List<Event> list = modelService.list(query);
		for (Event event : list) {
			EventData eventData = new EventData();
			eventData.setId(event.getId());
			eventData.setStartTime(event.getStartTime());
			eventData.setEndTime(event.getEndTime());
			eventData.setText(event.getName());
			String location = event.getLocation();
			/*Person organizer = modelService.getFirstSubRelation(event,Relation.KIND_EVENT_ORGANIZER, Person.class);
			if (organizer!=null) {
				User orgUser = modelService.getFirstSuperRelation(organizer,Relation.KIND_SYSTEM_USER_SELF, User.class);
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
		Event event = modelService.get(Event.class, id, getRequest().getSession());
		data.addHeader(event.getName());
		
		data.addProperty("Start:",formatDate(event.getStartTime()));
		data.addProperty("Slut:",formatDate(event.getEndTime()));
		data.addProperty("Lokation:",event.getLocation());

		List<Person> organizers = modelService.getChildren(event, Relation.KIND_EVENT_ORGANIZER,Person.class);
		data.addObjects("Underviser:", convertToObject(organizers));

		List<Person> attendees = modelService.getChildren(event, Relation.KIND_EVENT_ATTENDEE,Person.class);
		data.addObjects("Elever:", convertToObject(attendees));
		
		return data;
	}
	
	private Collection<ObjectData> convertToObject(List<? extends Entity> attendees) {
		Collection<ObjectData> objects = new ArrayList<ObjectData>();
		for (Entity entity : attendees) {
			objects.add(new ObjectData(entity.getId(),entity.getName()));
		}
		return objects;
	}

	public Collection<EventData> getEntityHistory(Date from, Date to) {
		Collection<EventData> data = Lists.newArrayList();
		Query<Entity> query = new Query<Entity>(Entity.class).withCreatedFrom(from).withCreatedTo(to);
		List<Entity> list = modelService.list(query);
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
		Person person = modelService.get(Person.class, id,getRequest().getSession());
		if (person!=null) {
			User user = modelService.getParent(person, Relation.KIND_SYSTEM_USER_SELF, User.class);
			if (user!=null) {
				return securityService.changeUser(getUserSession(), user.getUsername(), user.getPassword());
			}
		}
		return false;
	}

	public void setSecurityService(SecurityService securityService) {
		this.securityService = securityService;
	}

	public SecurityService getSecurityService() {
		return securityService;
	}
}
