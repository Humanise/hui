package dk.in2isoft.onlineobjects.core.exceptions;


public class ContentNotFoundException extends EndUserException {

	private static final long serialVersionUID = -351608398503987416L;

	public ContentNotFoundException() {
		super();
	}

	public ContentNotFoundException(Class<?> type, Number id) {
		super("Content of type "+type.getSimpleName()+" and id="+id+" was not found");
	}

	public ContentNotFoundException(String message, String code) {
		super(message,code);
	}

	public ContentNotFoundException(String message) {
		super(message);
	}

	public ContentNotFoundException(String message, Throwable throwable) {
		super(message, throwable);
	}

	public ContentNotFoundException(Throwable throwable) {
		super(throwable);
	}

}
