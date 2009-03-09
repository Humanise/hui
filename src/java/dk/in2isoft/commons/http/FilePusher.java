package dk.in2isoft.commons.http;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;

public class FilePusher {
    
    private File file;
    private boolean download;
    private boolean clientSideCaching;
    
    public FilePusher(File file) {
        this.file=file;
    }
    
    public void setDownload(boolean download) {
        this.download = download;
    }

	public void setClientSideCaching(boolean clientSideCaching) {
		this.clientSideCaching = clientSideCaching;
	}
    
    public void push(HttpServletResponse response, String contentType) {
        if (!clientSideCaching) {
            // Set to expire far in the past.
            response.setHeader("Expires", "Sat, 6 May 1995 12:00:00 GMT");
            // Set standard HTTP/1.1 no-cache headers.
            response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
            // Set IE extended HTTP/1.1 no-cache headers (use addHeader).
            response.addHeader("Cache-Control", "post-check=0, pre-check=0");
            // Set standard HTTP/1.0 no-cache header.
            response.setHeader("Pragma", "no-cache");
        }
        else {
            response.setDateHeader("Last-Modified", file.lastModified());
            response.setDateHeader("Expires", System.currentTimeMillis()+1000*60*300);
            response.setHeader("Cache-Control","max-age=2592000");
            response.setDateHeader("Date", System.currentTimeMillis());
        }
        if (contentType!=null && contentType.length()>0) {
            response.setContentType(contentType);
        }
        response.setContentLength((int) file.length());
        if (download) {
            response.setHeader("Content-Disposition","attachment; filename=\"" + file.getName() + "\"");
        }
        try {
        	FileInputStream input = new FileInputStream(file);
            ServletOutputStream out = response.getOutputStream();
            IOUtils.copy(input, out);
            input.close();
        }
        catch (FileNotFoundException e) {
            try {
                response.getWriter().print("File: "+file.getPath()+" not found!");
            }
            catch (IOException ignore) {}
        }
        catch (IOException e) {
            try {
                response.getWriter().print("File: "+file.getPath()+" not found!");
            }
            catch (IOException ignore) {}
        }
    }
    
}
