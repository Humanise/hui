package dk.in2isoft.in2igui.data;

public abstract class WidgetData {

	private String name;
	
	public WidgetData(String name) {
		super();
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
