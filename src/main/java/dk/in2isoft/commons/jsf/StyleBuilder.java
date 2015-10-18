package dk.in2isoft.commons.jsf;

public class StyleBuilder {

	StringBuilder sb;
	
	public StyleBuilder() {
		this.sb = new StringBuilder();
	}
	
	public StyleBuilder withWidth(Number width) {
		if (width!=null) {
			sb.append("width:").append(width).append("px;");
		}
		return this;
	}

	public StyleBuilder withWidth(String width) {
		sb.append("width:").append(width).append(";");
		return this;
	}
	
	public StyleBuilder withHeight(Number height) {
		if (height!=null) {
			sb.append("height:").append(height).append("px;");
		}
		return this;
	}
	
	@Override
	public String toString() {
		return sb.toString();
	}

	public StyleBuilder withMarginLeft(Integer size) {
		if (size!=null) {
			sb.append("margin-left:").append(size).append("px;");
		}
		return this;
	}

	public StyleBuilder withMarginRight(Integer size) {
		if (size!=null) {
			sb.append("margin-right:").append(size).append("px;");
		}
		return this;
	}

	public StyleBuilder withMargin(String margin) {
		sb.append("margin:").append(margin).append(";");
		return this;
	}

	public StyleBuilder withPaddingTop(Number top) {
		if (top!=null) {
			sb.append("padding-top:").append(top).append("px;");
		}
		return this;
	}

	public StyleBuilder withPaddingBottom(Number bottom) {
		if (bottom!=null) {
			sb.append("padding-bottom:").append(bottom).append("px;");
		}
		return this;
	}

	public StyleBuilder withPadding(Number bottom) {
		if (bottom!=null) {
			sb.append("padding:").append(bottom).append("px;");
		}
		return this;
	}

	public StyleBuilder withPadding(String string) {
		sb.append("padding:").append(string).append(";");
		return this;
	}

	public StyleBuilder withBackgroundImage(String url) {
		sb.append("background-image: url('").append(url).append("');");
		return this;
	}

	public StyleBuilder withRule(String style) {
		if (style!=null) {
			sb.append(style);
		}
		return this;
	}

	public boolean isEmpty() {
		return sb.length() == 0;
	}
}
