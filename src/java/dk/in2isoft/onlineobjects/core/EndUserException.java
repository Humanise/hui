package dk.in2isoft.onlineobjects.core;

public class EndUserException extends Exception {

	private static final long serialVersionUID = 1449397281498175390L;
	
	private String code;

	public EndUserException() {
		super();
	}

	public EndUserException(String message, String code) {
		super(message);
		this.code = code;
	}

	public EndUserException(String message) {
		super(message);
	}

	public EndUserException(String message, Throwable throwable) {
		super(message, throwable);
	}

	public EndUserException(Throwable throwable) {
		super(throwable);
	}
	
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

}
