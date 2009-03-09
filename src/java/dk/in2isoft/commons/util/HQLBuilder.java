package dk.in2isoft.commons.util;

public class HQLBuilder {

	private String method;
	private StringBuilder sb;
	
	private HQLBuilder(String method) {
		super();
		this.method=method;
		this.sb = new StringBuilder();
	}
	
	public static HQLBuilder select() {
		return new HQLBuilder("select");
	}
	
	@Override
	public String toString() {
		sb.insert(0, method);
		return sb.toString();
	}
}
