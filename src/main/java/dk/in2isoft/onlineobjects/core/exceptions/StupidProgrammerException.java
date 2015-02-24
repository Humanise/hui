package dk.in2isoft.onlineobjects.core.exceptions;


public class StupidProgrammerException extends EndUserException {

	private static final long serialVersionUID = 1449397281498175390L;

	public StupidProgrammerException() {
		super();
	}

	public StupidProgrammerException(String message, String code) {
		super(message,code);
	}

	public StupidProgrammerException(String message) {
		super(message);
	}

	public StupidProgrammerException(String message, Throwable throwable) {
		super(message, throwable);
	}

	public StupidProgrammerException(Throwable throwable) {
		super(throwable);
	}

}
