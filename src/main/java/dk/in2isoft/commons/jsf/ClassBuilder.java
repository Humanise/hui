package dk.in2isoft.commons.jsf;

import org.apache.commons.lang.StringUtils;

public class ClassBuilder {

	StringBuilder sb;
	
	public ClassBuilder() {
		this.sb = new StringBuilder();
	}
	
	public ClassBuilder(String name) {
		this.sb = new StringBuilder(name);
	}
	
	public static ClassBuilder with(String name) {
		return new ClassBuilder(name);
	}
	
	public ClassBuilder add(String name) {
		if (StringUtils.isBlank(name)) {
			return this;
		}
		if (sb.length()>0) {
			sb.append(" ");
		}
		sb.append(name);
		return this;
	}
	
	public ClassBuilder add(String prefix, Number name) {
		if (name!=null) {
			return add(prefix, name.toString());
		}
		return this;
	}
	
	public ClassBuilder add(String prefix, String variant) {
		if (StringUtils.isBlank(variant)) {
			return this;
		}
		if (sb.length()>0) {
			sb.append(" ");
		}
		sb.append(prefix).append("_").append(variant);
		return this;
	}
	
	@Override
	public String toString() {
		return sb.toString();
	}
}
