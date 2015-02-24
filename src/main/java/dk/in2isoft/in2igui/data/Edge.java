package dk.in2isoft.in2igui.data;

public class Edge {

	private String from;
	private String to;
	private String label;
	
	public Edge() {
		
	}

	public Edge(String from, String to) {
		super();
		this.from = from;
		this.to = to;
	}

	public Edge(String from, String label,String to) {
		super();
		this.label = label;
		this.from = from;
		this.to = to;
	}
	
	public String getFrom() {
		return from;
	}

	public void setFrom(String from) {
		this.from = from;
	}

	public String getTo() {
		return to;
	}

	public void setTo(String to) {
		this.to = to;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}
}
