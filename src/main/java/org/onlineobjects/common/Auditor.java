package org.onlineobjects.common;

public interface Auditor {

	public void info(String message);
	
	public void warn(String message);

	public void error(String message);
}
