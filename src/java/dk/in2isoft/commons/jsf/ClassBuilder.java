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
	
	public static ClassBuilder add(String name) {
		return new ClassBuilder(name);
	}
	
	public ClassBuilder append(String name) {
		if (StringUtils.isBlank(name)) {
			return this;
		}
		if (sb.length()>0) {
			sb.append(" ");
		}
		sb.append(name);
		return this;
	}
	
	public ClassBuilder append(String prefix, String name) {
		if (StringUtils.isBlank(name)) {
			return this;
		}
		if (sb.length()>0) {
			sb.append(" ");
		}
		sb.append(prefix).append(name);
		return this;
	}
	
	@Override
	public String toString() {
		return sb.toString();
	}
}
