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
    	if (!file.exists()) {
            try {
            	HeaderUtil.setNotFound(response);
				response.getWriter().print("File: "+file.getPath()+" not found!");
			} catch (IOException e) {
            	HeaderUtil.setInternalServerError(response);
			}
			return;
    	}
        if (!clientSideCaching) {
        	HeaderUtil.setNoCache(response);
        }
        else {
        	HeaderUtil.setModified(file,response);
            HeaderUtil.setOneMonthCache(response);
        }
        if (contentType!=null && contentType.length()>0) {
            response.setContentType(contentType);
        }
        response.setContentLength((int) file.length());
        if (download) {
        	HeaderUtil.setContentDisposition(file.getName(),response);
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
            catch (IllegalStateException ignore) {}
        }
    }
    
}
