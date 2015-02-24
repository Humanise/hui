package dk.in2isoft.in2igui.data;

public class TextFieldData extends WidgetData {

	private String value;
	
	public TextFieldData(String name) {
		super(name);
	}

	public TextFieldData(String name, String value) {
		super(name);
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
