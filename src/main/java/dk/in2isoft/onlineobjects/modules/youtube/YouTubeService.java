package dk.in2isoft.onlineobjects.modules.youtube;

import org.apache.commons.lang.StringUtils;

import dk.in2isoft.commons.util.RegExpUtil;

public class YouTubeService {

	public String extractCodeFromUrl(String url) {
		if (StringUtils.isBlank(url)) {
			return null;
		}
		String[] groups = RegExpUtil.getGroups(url,"http://www\\.youtube\\.com/watch\\?v=([a-z_A-Z0-9\\-]+)");
		if (groups!=null) {
			return groups[1];
		}
		return null;
	}
	
	public boolean isSupportedUrl(String url) {
		return extractCodeFromUrl(url)!=null;
	}
	
	public String getEmbedHTML(String code) {
		StringBuilder html = new StringBuilder();
		html.append("<object width=\"580\" height=\"340\">");
		html.append("<param name=\"movie\" value=\"http://www.youtube.com/v/").append(code).append("&hl=en_US&fs=1&\"></param>");
		html.append("<param name=\"allowFullScreen\" value=\"true\"></param>");
		html.append("<param name=\"allowscriptaccess\" value=\"always\"></param>");
		html.append("<embed src=\"http://www.youtube.com/v/").append(code).append("&hl=en_US&fs=1&\" type=\"application/x-shockwave-flash\" allowscriptaccess=\"always\" allowfullscreen=\"true\" width=\"580\" height=\"340\"></embed>");
		html.append("</object>");
		return html.toString();
	}
}
