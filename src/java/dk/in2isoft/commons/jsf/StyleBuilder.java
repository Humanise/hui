package dk.in2isoft.commons.jsf;

public class StyleBuilder {

	StringBuilder sb;
	
	public StyleBuilder() {
		this.sb = new StringBuilder();
	}
	
	public StyleBuilder withWidth(Number width) {
		sb.append("width:").append(width).append("px;");
		return this;
	}
	
	public StyleBuilder withHeight(Number height) {
		sb.append("height:").append(height).append("px;");
		return this;
	}
	
	@Override
	public String toString() {
		return sb.toString();
	}

	public StyleBuilder withMarginLeft(int size) {
		sb.append("margin-left:").append(size).append("px;");
		return this;
	}

	public StyleBuilder withMargin(String margin) {
		sb.append("margin:").append(margin).append(";");
		return this;
	}
}
