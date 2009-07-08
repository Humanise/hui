package dk.in2isoft.onlineobjects.apps.school;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import dk.in2isoft.commons.lang.LangUtil;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Event;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.pipes.PipelineStageAdapter;

public class SynchronizerStage extends PipelineStageAdapter {

	public static final String CONFIG_URL = "url";

	private int maxDelete;

	private Date startTime;

	private int number;

	private User publicUser;

	private List<Relation> eventRelations;

	private Event cachedEvent;

	private List<Person> eventPersons;

	private Person cachedNewTeacher;

	public SynchronizerStage() {
		super();
		startTime = new Date();
		publicUser = Core.getInstance().getModel().getUser("public");
	}
	
	public int getMaxDelete() {
		return maxDelete;
	}

	public void setMaxDelete(int maxDelete) {
		this.maxDelete = maxDelete;
	}

	@Override
	public void receiveResultSet(ResultSet rs) throws SQLException {
		EasyEvent easyEvent = new EasyEvent();

		DateTimeFormatter fmt = DateTimeFormat.forPattern("HH:mm");

		Date date = rs.getDate("DATO");

		DateTime startDate = new DateTime(date);
		DateTime endDate = new DateTime(date);

		DateTime startHour = fmt.parseDateTime(rs.getString("STARTTID"));
		startDate = startDate.withHourOfDay(startHour.getHourOfDay());
		startDate = startDate.withMinuteOfHour(startHour.getMinuteOfHour());

		DateTime endHour = fmt.parseDateTime(rs.getString("SLUTTID"));
		endDate = endDate.withHourOfDay(endHour.getHourOfDay());
		endDate = endDate.withMinuteOfHour(endHour.getMinuteOfHour());

		easyEvent.setStartTime(startDate.toDate());
		easyEvent.setEndTime(endDate.toDate());
		easyEvent.setStudentInitials(rs.getString("BRUGERNAVN"));
		easyEvent.setStudentFirstName(rs.getString("FORNAVN"));
		easyEvent.setStudentLastName(rs.getString("EFTERNAVN"));
		easyEvent.setEventTitle(rs.getString("skf"));
		easyEvent.setRemoteEventId(rs.getString("SKEMABEG_ID"));
		easyEvent.setRemoteStudentId(rs.getString("PERS_ID"));
		easyEvent.setLocation(rs.getString("LOKALENAVN"));
		easyEvent.setTeacherInitials(rs.getString("INITIALER_RED"));
		easyEvent.setTeacherFirstName(rs.getString("Expr2"));
		easyEvent.setTeacherLastName(rs.getString("Expr3"));

		sync(easyEvent);
	}

	@Override
	public void receiveMappedLineKeys(String[] keys) throws IOException {
		// Do nothing with the keys
	}

	public void receiveMappedLine(Map<String, String> map) {
		EasyEvent easyEvent = new EasyEvent();

		String date = map.get("DATE");
		String startTime = map.get("STARTTIME");
		String endTime = map.get("ENDTIME");
		DateTimeFormatter fmt = DateTimeFormat.forPattern("yy-MM-dd HH:mm");
		DateTime startDate = fmt.parseDateTime(date + " " + startTime);
		DateTime endDate = fmt.parseDateTime(date + " " + endTime);

		easyEvent.setStartTime(startDate.toDate());
		easyEvent.setEndTime(endDate.toDate());
		easyEvent.setStudentFirstName(map.get("STUDENT_FIRSTNAME"));
		easyEvent.setStudentLastName(map.get("STUDENT_LASTNAME"));
		easyEvent.setStudentInitials(map.get("STUDENT_ID"));
		easyEvent.setEventTitle(map.get("EVENT_TITLE"));
		easyEvent.setRemoteEventId(map.get("EVENT_ID"));
		easyEvent.setRemoteStudentId(map.get("STUDENT_ID"));
		easyEvent.setLocation(map.get("LOCATION"));
		easyEvent.setTeacherInitials(map.get("TEACHER_INITIALS"));
		easyEvent.setTeacherFirstName(map.get("TEACHER_FIRSTNAME"));
		easyEvent.setTeacherLastName(map.get("TEACHER_LASTNAME"));
		sync(easyEvent);
	}

	private void sync(EasyEvent easyEvent) {

		try {

			ModelService model = Core.getInstance().getModel();
			
			Event event = getEvent(easyEvent.getRemoteEventId());
			if (event.isNew() || event.getUpdated().getTime() < startTime.getTime()) {
				event.setStartTime(easyEvent.getStartTime());
				event.setEndTime(easyEvent.getEndTime());
				event.setName(easyEvent.getEventTitle());
				event.setLocation(easyEvent.getLocation());

				if (event.isNew()) {
					model.createItem(event, publicUser);
				} else if (event.getUpdated().getTime() < this.startTime.getTime()) {
					model.updateItem(event, publicUser);
				}
			}
			
			Person student = getCachedPerson(easyEvent.getRemoteStudentId());
			if (student == null) {
				// If no cached student is found
				Query<Person> query = new Query<Person>(Person.class).withCustomProperty("sync.remote.id", easyEvent
						.getRemoteStudentId());
				List<Person> students = model.list(query);
				if (students.size() > 0) {
					student = students.get(0);
				}
			}
			// If no persistent student is found
			if (student == null) {
				student = new Person();
				student.overrideFirstProperty("sync.remote.id", easyEvent.getRemoteStudentId());
				student.overrideFirstProperty("sync.remote.source", "EASY");
			}
			boolean checkUser = false;
			if (student.isNew()) {
				student.setGivenName(easyEvent.getStudentFirstName());
				student.setFamilyName(easyEvent.getStudentLastName());
				model.createItem(student, publicUser);
				checkUser = true;
			} else if (student.getUpdated().getTime() < this.startTime.getTime()) {
				if (!easyEvent.getStudentFirstName().equals(student.getGivenName()) && !easyEvent.getStudentLastName().equals(student.getFamilyName())) {
					student.setGivenName(easyEvent.getStudentFirstName());
					student.setFamilyName(easyEvent.getStudentLastName());
					model.updateItem(student, publicUser);
				} else {
					context.debug(this, "Skipped person with no name change");
				}
			}
			if (checkUser) {
				// TODO start with User
				User user = model.getParent(student, Relation.KIND_SYSTEM_USER_SELF, User.class);
				if (user == null) {
					user = new User();
					user.setUsername(easyEvent.getStudentInitials());
					user.setPassword("changeme");
					user.overrideFirstProperty("sync.remote.id", easyEvent.getRemoteStudentId());
					user.overrideFirstProperty("sync.remote.source", "EASY");
					model.createItem(user, publicUser);
					Relation relation = new Relation(user, student);
					relation.setKind(Relation.KIND_SYSTEM_USER_SELF);
					model.createItem(relation, user);
					model.grantFullPrivileges(student, user);
				} else if (!easyEvent.getStudentInitials().equals(user.getUsername())) {
					user.setUsername(easyEvent.getStudentInitials());
				}
			} else {
				context.debug(this, "Skipped user");
			}

			Relation attendeeRelation = getEventRelation(event, student, Relation.KIND_EVENT_ATTENDEE);
			if (attendeeRelation == null) {
				model.createRelation(event, student, Relation.KIND_EVENT_ATTENDEE, publicUser);
			}
			
			if (LangUtil.isDefined(easyEvent.getTeacherInitials())) {
				// Check for existing teacher on the event
				Person teacher = getCachedPerson(easyEvent.getTeacherInitials());
				if (teacher==null) {
					// If no teacher, check if a new teacher already has been created
					if (cachedNewTeacher!=null && easyEvent.getTeacherInitials().equals(cachedNewTeacher.getPropertyValue("sync.remote.id"))) {
						teacher = cachedNewTeacher;
					} else {
						Query<Person> query = new Query<Person>(Person.class).withCustomProperty("sync.remote.id", easyEvent
								.getTeacherInitials());
						List<Person> teachers = model.list(query);
						if (teachers.size() > 0) {
							teacher = teachers.get(0);
						} else {
							// If no teacher on event and no new teacher
							teacher = new Person();
							teacher.overrideFirstProperty("sync.remote.id", easyEvent.getTeacherInitials());
							teacher.overrideFirstProperty("sync.remote.source", "EASY");
						}
						cachedNewTeacher = teacher;
					}
				}
				boolean teacherIsNewlyCreated = false;
				if (teacher.isNew()) {
					// Create teacher if new
					teacher.setGivenName(easyEvent.getTeacherFirstName());
					teacher.setFamilyName(easyEvent.getTeacherLastName());
					model.createItem(teacher, publicUser);
					teacherIsNewlyCreated = true;
				} else if (teacher.getUpdated().getTime() < this.startTime.getTime()) {
					if (!easyEvent.getTeacherFirstName().equals(teacher.getGivenName()) && !easyEvent.getTeacherLastName().equals(teacher.getFamilyName())) {
						// Only update if name is changed
						teacher.setGivenName(easyEvent.getTeacherFirstName());
						teacher.setFamilyName(easyEvent.getTeacherLastName());
						model.updateItem(teacher, publicUser);
					} else {
						context.debug(this,"Skipped teacher with no name change");
					}
				}
				
				Relation organizerRelation = getEventRelation(event, teacher, Relation.KIND_EVENT_ORGANIZER);
				if (organizerRelation == null) {
					model.createRelation(event, teacher, Relation.KIND_EVENT_ORGANIZER, publicUser);
				}
				if (teacherIsNewlyCreated) {
					// Only check for the teachers user if the teacher is new
					User teacherUser = model.getParent(teacher, Relation.KIND_SYSTEM_USER_SELF, User.class);
					if (teacherUser == null) {
						teacherUser = new User();
						teacherUser.setUsername(easyEvent.getTeacherInitials());
						teacherUser.setPassword("changeme");
						teacherUser.overrideFirstProperty("sync.remote.id", easyEvent.getTeacherInitials());
						teacherUser.overrideFirstProperty("sync.remote.source", "EASY");
						model.createItem(teacherUser, publicUser);
						Relation relation = new Relation(teacherUser, teacher);
						relation.setKind(Relation.KIND_SYSTEM_USER_SELF);
						model.createItem(relation, teacherUser);
						model.grantFullPrivileges(teacher, teacherUser);
					}
				} else {
					context.debug(this,"Skipped check of teachers user");
				}
			} else {
				context.debug(this, "Skipped teacher with no initials" + easyEvent.getEventTitle());
			}
			if (number % 50 == 0) {
				model.commit();
			}
			number++;
		} catch (ModelException e) {
			context.error(e);
		} catch (SecurityException e) {
			context.error(e);
		}
	}

	private Person getCachedPerson(String remoteId) {
		if (eventPersons != null) {
			for (Person person : eventPersons) {
				if (remoteId.equals(person.getPropertyValue("sync.remote.id"))) {
					context.debug(this, "Found cached person: "+remoteId);
					return person;
				}
			}
		}
		return null;
	}

	private Event getEvent(String remoteEventId) throws ModelException {
		if (cachedEvent != null && remoteEventId.equals(cachedEvent.getPropertyValue("sync.remote.id"))) {
			context.debug(this, "Found cached event");
			return cachedEvent;
		} else {
			ModelService model = Core.getInstance().getModel();
			Query<Event> eventQuery = new Query<Event>(Event.class).withCustomProperty("sync.remote.id", remoteEventId);
			List<Event> events = model.list(eventQuery);
			Event event = null;
			if (events.size() > 0) {
				event = events.get(0);
			} else {
				event = new Event();
				event.overrideFirstProperty("sync.remote.id", remoteEventId);
				event.overrideFirstProperty("sync.remote.source", "EASY");
			}
			cachedEvent = event;
			reloadEventCache();
			return event;
		}
	}

	private void reloadEventCache() throws ModelException {
		ModelService model = Core.getInstance().getModel();
		if (cachedEvent.isNew()) {
			eventRelations = null;
			eventPersons = null;
		} else {
			eventRelations = model.getChildRelations(cachedEvent);
			eventPersons = new ArrayList<Person>();
			for (Relation relation : eventRelations) {
				Entity entity = ModelService.getSubject(relation.getSubEntity());
				if (entity.getType().equals(Person.TYPE)) {
					eventPersons.add((Person) entity);
				}
			}
			context.debug(this, "Cached relations: " + eventRelations.size());
			context.debug(this, "Cached persons: " + eventPersons.size());
		}
	}

	private Relation getEventRelation(Event event, Person student, String kind) {
		if (eventRelations != null) {
			for (Relation relation : eventRelations) {
				if (kind.equals(relation.getKind()) && relation.getSubEntity().getId() == student.getId()) {
					//Core.getInstance().getModel().addToSession(relation);
					context.debug(this, "Found cached relation: " + relation.getId());
					return relation;
				}
			}
		}
		ModelService model = Core.getInstance().getModel();
		return model.getRelation(event, student, kind);
	}

	@Override
	public void cleanUp() {
		if (number==0) {
			context.info(this, "Don't perform event cleanup since no data has been processed");
			return;
		}
		context.info(this, "Searching for events to delete");
		ModelService model = Core.getInstance().getModel();
		model.commit();
		Query<Event> query = Query.of(Event.class).withPriviledged(publicUser).withFieldValueLessThan("updated", startTime).withFieldValueMoreThan(
				"starttime", startTime);
		if (maxDelete>0) {
			query.withPaging(0, maxDelete);
		}
		List<Event> ids = model.list(query);
		int size = ids.size();
		context.info(this, "Starting deleting events: " + size);
		int num = 0;
		for (Event event : ids) {
			num++;
			try {
				model.deleteEntity(event, publicUser);
			} catch (EndUserException e) {
				context.error(e);
			}
			if (num % 10 == 0) {
				model.commit();
				context.info(this, "Deleted "+num+" events so far = "+Math.round((float)num/(float)size*100)+"%");
			}
		}
		model.commit();
		context.info(this, "Finished deleting events: " + size);
	}

	private class EasyEvent {

		String remoteStudentId;

		String studentInitials;

		String studentFirstName;

		String studentLastName;

		String eventTitle;

		Date startTime;

		Date endTime;

		String remoteEventId;

		String location;

		String teacherInitials;

		String teacherFirstName;

		String teacherLastName;

		private EasyEvent() {

		}

		public String getStudentFirstName() {
			return studentFirstName;
		}

		public void setStudentFirstName(String studentFirstName) {
			this.studentFirstName = studentFirstName;
		}

		public String getStudentLastName() {
			return studentLastName;
		}

		public void setStudentLastName(String studentLastName) {
			this.studentLastName = studentLastName;
		}

		public String getEventTitle() {
			return eventTitle;
		}

		public void setEventTitle(String eventTitle) {
			this.eventTitle = eventTitle;
		}

		public Date getStartTime() {
			return startTime;
		}

		public void setStartTime(Date startTime) {
			this.startTime = startTime;
		}

		public Date getEndTime() {
			return endTime;
		}

		public void setEndTime(Date endTime) {
			this.endTime = endTime;
		}

		public String getRemoteEventId() {
			return remoteEventId;
		}

		public void setRemoteEventId(String remoteEventId) {
			this.remoteEventId = remoteEventId;
		}

		public String getRemoteStudentId() {
			return remoteStudentId;
		}

		public void setRemoteStudentId(String remoteStudentId) {
			this.remoteStudentId = remoteStudentId;
		}

		public String getLocation() {
			return location;
		}

		public void setLocation(String location) {
			this.location = location;
		}

		public String getTeacherInitials() {
			return teacherInitials;
		}

		public void setTeacherInitials(String teacherInitials) {
			this.teacherInitials = teacherInitials;
		}

		public String getTeacherFirstName() {
			return teacherFirstName;
		}

		public void setTeacherFirstName(String teacherFirstName) {
			this.teacherFirstName = teacherFirstName;
		}

		public String getTeacherLastName() {
			return teacherLastName;
		}

		public void setTeacherLastName(String teacherLastName) {
			this.teacherLastName = teacherLastName;
		}

		public String getStudentInitials() {
			return studentInitials;
		}

		public void setStudentInitials(String studentInitials) {
			this.studentInitials = studentInitials;
		}

	}
}
