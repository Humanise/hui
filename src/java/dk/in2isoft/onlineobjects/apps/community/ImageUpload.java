package dk.in2isoft.onlineobjects.apps.community;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.google.common.collect.Maps;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.ui.Request;

public class ImageUpload {

	
	public void upload(Request request, ImageUploadDelegate delegate) throws EndUserException, IOException {

		DiskFileItemFactory factory = new DiskFileItemFactory();
		factory.setSizeThreshold(0);
		Map<String,String> parameters = Maps.newHashMap();
		ServletFileUpload upload = new ServletFileUpload(factory);
		try {
			List<DiskFileItem> items = upload.parseRequest(request.getRequest());
			for (DiskFileItem item : items) {
				if (item.isFormField() && item.getFieldName() != null) {
					parameters.put(item.getFieldName(), item.getString());
				}
			}
			for (DiskFileItem item : items) {
				if (!item.isFormField()) {
					File file = item.getStoreLocation();
					delegate.handleFile(file, item.getName(), item.getContentType(), parameters, request);
				}
			}
		} catch (FileUploadException e) {
			throw new EndUserException(e);
		}
		request.getResponse().setStatus(HttpServletResponse.SC_OK);
		request.getResponse().getWriter().write("OK");
	}
}
