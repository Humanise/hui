package dk.in2isoft.onlineobjects.core;

public class EndUserException extends Exception {

	private static final long serialVersionUID = 1449397281498175390L;
	
	public EndUserException() {
		super();
	}

	public EndUserException(String arg0) {
		super(arg0);
	}

	public EndUserException(String arg0, Throwable arg1) {
		super(arg0, arg1);
	}

	public EndUserException(Throwable arg0) {
		super(arg0);
	}
	
	public String getDescription() {
		return "See this: ?";
	}

}
