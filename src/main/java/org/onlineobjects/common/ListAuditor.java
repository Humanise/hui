package org.onlineobjects.common;

import java.util.List;

import com.google.common.collect.Lists;

public class ListAuditor implements Auditor {

	private List<String> log = Lists.newArrayList();
	
	@Override
	public void info(String message) {
		log.add("INFO: "+message);
	}

	@Override
	public void warn(String message) {
		log.add("WARN: "+message);
	}

	@Override
	public void error(String message) {
		log.add("ERROR: "+message);
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		for (String line : log) {
			if (sb.length()>0) {
				sb.append("\n");
			}
			sb.append(line);
		}
		return sb.toString();
	}
}
