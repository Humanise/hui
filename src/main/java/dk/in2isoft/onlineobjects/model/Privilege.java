package dk.in2isoft.onlineobjects.model;

public class Privilege {
	
	private long id;
	private long subject;
	private long object;
	private boolean alter;
	private boolean delete;
	private boolean view;
	private boolean reference;
	
	public Privilege() {
		super();
	}
	
	public Privilege(long subject, long object) {
		super();
		this.subject = subject;
		this.object = object;
	}
	
	public Privilege(long subject, long object, boolean allRights) {
		super();
		this.subject = subject;
		this.object = object;
		if (allRights) {
			alter = delete = view = reference = true;
		}
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	
	public long getObject() {
		return object;
	}
	public void setObject(long object) {
		this.object = object;
	}
	public long getSubject() {
		return subject;
	}
	public void setSubject(long subject) {
		this.subject = subject;
	}
	
	public boolean isAlter() {
		return alter;
	}
	public void setAlter(boolean alter) {
		this.alter = alter;
	}
	public boolean isDelete() {
		return delete;
	}
	public void setDelete(boolean delete) {
		this.delete = delete;
	}
	public boolean isReference() {
		return reference;
	}
	public void setReference(boolean reference) {
		this.reference = reference;
	}
	public boolean isView() {
		return view;
	}
	public void setView(boolean view) {
		this.view = view;
	}
}
