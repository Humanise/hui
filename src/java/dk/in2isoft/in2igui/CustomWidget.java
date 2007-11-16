package dk.in2isoft.in2igui;

public class CustomWidget implements Widget {

	private StringBuilder gui = new StringBuilder();
	
	public CustomWidget append(String str) {
		gui.append(str);
		return this;
	}
	
	public void assemble(StringBuilder gui) {
		gui.append(this.gui);
	}

}
