package dk.in2isoft.commons.http;

import java.io.File;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import com.google.common.collect.ImmutableMap;

import dk.in2isoft.commons.util.RegExpUtil;

public class HeaderUtil {
	
	private static long secondsInWeek = 604800;
	private static long secondsIn31days = 2678400;
	
	private static Map<String,String> mimeTypes = new ImmutableMap.Builder<String, String>().put("html", "text/html").put("htm", "text/html").put(
			"xhtml", "application/xhtml+xml").put("js", "text/javascript").put("css", "text/css").put("png",
			"image/png").put("gif", "image/gif").put("jpg", "image/jpeg").put("jpeg", "image/jpeg").put("swf",
			"application/x-shockwave-flash").put("woff", "application/x-font-woff").put("eot", "application/vnd.ms-fontobject").put("otf", "application/octet-stream").put("ttf", "application/octet-stream").build();
	
	public static void setOneWeekCache(HttpServletResponse response) {		
        response.setDateHeader("Expires", System.currentTimeMillis()+604800*1000);
        response.setHeader("Cache-Control","public; max-age="+secondsInWeek);
        response.setDateHeader("Date", System.currentTimeMillis());
	}
	
	public static void setOneMonthCache(HttpServletResponse response) {		
        response.setDateHeader("Expires", System.currentTimeMillis()+secondsIn31days*1000);
        response.setHeader("Cache-Control","public; max-age="+secondsIn31days);
        response.setDateHeader("Date", System.currentTimeMillis());
	}

	public static void setNoCache(HttpServletResponse response) {
        // Set to expire far in the past.
        response.setHeader("Expires", "Sat, 6 May 1995 12:00:00 GMT");
        // Set standard HTTP/1.1 no-cache headers.
        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        // Set IE extended HTTP/1.1 no-cache headers (use addHeader).
        response.addHeader("Cache-Control", "post-check=0, pre-check=0");
        // Set standard HTTP/1.0 no-cache header.
        response.setHeader("Pragma", "no-cache");
	}

	public static void setModified(File file, HttpServletResponse response) {
        response.setDateHeader("Last-Modified", file.lastModified());
	}

	public static void setContentDisposition(String name, HttpServletResponse response) {
        response.setHeader("Content-Disposition","attachment; filename=\"" + name + "\"");
	}

	public static void setNotFound(HttpServletResponse response) {
        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
	}

	public static void setInternalServerError(HttpServletResponse response) {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
	}
	
	public static String getContentTypeEncoding(String value) {
		if (value!=null) {
			String[] groups = RegExpUtil.getGroups(value, "charset=([a-zA-Z0-9\\-]+)");
			if (groups!=null) {
				return groups[1].toUpperCase();
			}
		}
		return null;
	}

	public static String getMimeType(File file) {
		String name = file.getName();
		int pos = name.lastIndexOf(".");
		if (pos != -1) {
			String ext = name.substring(pos + 1);
			return mimeTypes.get(ext);
		} else {
			return null;
		}
	}

	public static String getContentTypesMimeType(String value) {
		if (value==null) {
			return null;
		}
		if (value.contains(";")) {
			return value.split(";")[0].trim();
		}
		return value.trim();
	}
}
