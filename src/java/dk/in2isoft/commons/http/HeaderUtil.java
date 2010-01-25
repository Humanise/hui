package dk.in2isoft.commons.http;

import java.io.File;

import javax.servlet.http.HttpServletResponse;

public class HeaderUtil {
	
	private static long secondsInWeek = 604800;
	private static long secondsIn31days = 2678400;
	
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
}
