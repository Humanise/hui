package dk.in2isoft.onlineobjects.core.exceptions;

public class IllegalRequestException extends EndUserException {

	private static final long serialVersionUID = 1449397281498175390L;

	public IllegalRequestException() {
		super();
	}

	public IllegalRequestException(String message, String code) {
		super(message,code);
	}

	public IllegalRequestException(String message) {
		super(message);
	}

	public IllegalRequestException(String message, Throwable throwable) {
		super(message, throwable);
	}

	public IllegalRequestException(Throwable throwable) {
		super(throwable);
	}

}
