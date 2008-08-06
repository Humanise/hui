package dk.in2isoft.onlineobjects.apps.school;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelFacade;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SecurityException;
import dk.in2isoft.onlineobjects.model.Event;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.pipes.PipelineStageAdapter;

public class SynchronizerStage extends PipelineStageAdapter {

	public static final String CONFIG_URL = "url";

	private static Logger log = Logger.getLogger(SynchronizerStage.class);

	private Collection<String> ids = new ArrayList<String>();

	private long startTime;
	private int number;

	private User publicUser;

	public SynchronizerStage() {
		super();
		startTime = new Date().getTime();
		publicUser = Core.getInstance().getModel().getUser("public");
	}
	
	

	@Override
	public void receiveMappedLineKeys(String[] keys) throws IOException {
		// Do nothing with the keys
	}

	public void receiveMappedLine(Map<String, String> map) {
		String studentFirstName = map.get("STUDENT_FIRSTNAME");
		String studentLastName = map.get("STUDENT_LASTNAME");
		String eventTitle = map.get("EVENT_TITLE");
		String date = map.get("DATE");
		String startTime = map.get("STARTTIME");
		String endTime = map.get("ENDTIME");
		String remoteEventId = map.get("EVENT_ID");
		String remoteStudentId = map.get("STUDENT_ID");
		String location = map.get("LOCATION");
		String teacherInitials = map.get("TEACHER_INITIALS");
		String teacherFirstName = map.get("TEACHER_FIRSTNAME");
		String teacherLastName = map.get("TEACHER_LASTNAME");

		try {

			ModelFacade model = Core.getInstance().getModel();
			Query<Person> query = new Query<Person>(Person.class).withCustomProperty("sync.remoteId", remoteStudentId);
			List<Person> students = model.search(query);
			Person student = null;
			if (students.size() > 0) {
				student = students.get(0);
			} else {
				student = new Person();
				student.overrideFirstProperty("sync.remoteId", remoteStudentId);
			}
			student.setGivenName(studentFirstName);
			student.setFamilyName(studentLastName);
			if (student.isNew()) {
				if (ids.contains(remoteStudentId)) {
					log.error("ID exists: " + remoteStudentId);
				}
				model.createItem(student, publicUser);
			} else if (student.getUpdated().getTime() < this.startTime) {
				model.updateItem(student, publicUser);
			}
			ids.add(remoteStudentId);

			// TODO start with User
			User user = model.getFirstSuperRelation(student, Relation.KIND_SYSTEM_USER_SELF, User.class);
			if (user == null) {
				user = new User();
				user.setUsername(remoteStudentId);
				user.setPassword("changeme");
				user.overrideFirstProperty("sync.remoteId", remoteStudentId);
				model.createItem(user, publicUser);
				Relation relation = new Relation(user, student);
				relation.setKind(Relation.KIND_SYSTEM_USER_SELF);
				model.createItem(relation, user);
				model.grantFullPrivileges(student, user);
			}

			Query<Event> eventQuery = new Query<Event>(Event.class).withCustomProperty("sync.remoteId", remoteEventId);
			List<Event> events = model.search(eventQuery);
			Event event = null;
			if (events.size() > 0) {
				event = events.get(0);
			} else {
				event = new Event();
				event.overrideFirstProperty("sync.remoteId", remoteEventId);
			}

			DateTimeFormatter fmt = DateTimeFormat.forPattern("yy-MM-dd HH:mm");
			DateTime startDate = fmt.parseDateTime(date + " " + startTime);
			DateTime endDate = fmt.parseDateTime(date + " " + endTime);
			event.setStartTime(startDate.toDate());
			event.setEndTime(endDate.toDate());
			event.setName(eventTitle);
			event.setLocation(location);

			if (event.isNew()) {
				model.createItem(event, publicUser);
			} else if (event.getUpdated().getTime() < this.startTime) {
				model.updateItem(event, publicUser);
			}

			Relation attendeeRelation = model.getRelation(event, student, Relation.KIND_EVENT_ATTENDEE);
			if (attendeeRelation == null) {
				model.createRelation(event, student, Relation.KIND_EVENT_ATTENDEE, publicUser);
			}

			model.getUser(teacherInitials);
			Query<Person> teacherQuery = Query.ofType(Person.class)
					.withCustomProperty("sync.remoteId", teacherInitials);
			List<Person> teachers = model.search(teacherQuery);
			Person teacher;
			if (!teachers.isEmpty()) {
				teacher = teachers.get(0);
			} else {
				teacher = new Person();
				teacher.overrideFirstProperty("sync.remoteId", teacherInitials);
			}
			teacher.setGivenName(teacherFirstName);
			teacher.setFamilyName(teacherLastName);

			if (teacher.isNew()) {
				model.createItem(teacher, publicUser);
			} else if (teacher.getUpdated().getTime() < this.startTime) {
				model.updateItem(teacher, publicUser);
			}

			Relation organizerRelation = model.getRelation(event, teacher, Relation.KIND_EVENT_ORGANIZER);
			if (organizerRelation == null) {
				model.createRelation(event, teacher, Relation.KIND_EVENT_ORGANIZER, publicUser);
			}

			User teacherUser = model.getFirstSuperRelation(teacher, Relation.KIND_SYSTEM_USER_SELF, User.class);
			if (teacherUser == null) {
				teacherUser = new User();
				teacherUser.setUsername(teacherInitials);
				teacherUser.setPassword("changeme");
				teacherUser.overrideFirstProperty("sync.remoteId", teacherInitials);
				model.createItem(teacherUser, publicUser);
				Relation relation = new Relation(teacherUser, teacher);
				relation.setKind(Relation.KIND_SYSTEM_USER_SELF);
				model.createItem(relation, teacherUser);
				model.grantFullPrivileges(teacher, teacherUser);
			}
			if (number % 50 == 0) {
				model.commit();
			}
			number++;
		} catch (ModelException e) {

		} catch (SecurityException e) {

		}
	}
}
