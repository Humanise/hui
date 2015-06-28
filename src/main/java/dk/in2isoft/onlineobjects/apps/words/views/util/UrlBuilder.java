package dk.in2isoft.onlineobjects.apps.words.views.util;

import dk.in2isoft.commons.lang.Strings;

public class UrlBuilder {
	private StringBuilder sb = new StringBuilder();
	
	private boolean hasParameters;
	
	public UrlBuilder(String path) {
		folder(path);
	}
	
	public UrlBuilder folder(Number num) {
		return folder(num.toString());
	}

	public UrlBuilder folder(String path) {
		if (Strings.isNotBlank(path)) {
			if (sb.length()==0) {
				if (!path.startsWith("http")) {
					sb.append("/");
				}
			}
			sb.append(path);
			if (!path.endsWith("/")) {
				sb.append("/");
			}
		}
		return this;
	}
	
	public UrlBuilder parameter(String key,Object value) {
		if (value!=null) {
			String str = value.toString();
			if (Strings.isNotBlank(str)) {
				sb.append(hasParameters ? "&" : "?");
				sb.append(key).append("=").append(value);
				hasParameters = true;
			}
		}
		return this;
	}

	public String get() {
		return sb.toString();
	}

	@Override
	public String toString() {
		return sb.toString();
	}
}
