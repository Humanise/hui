package dk.in2isoft.onlineobjects.service.ooconverter;

import java.io.File;
import java.io.IOException;

import dk.in2isoft.commons.http.FileDownload;
import dk.in2isoft.commons.http.FilePusher;
import dk.in2isoft.commons.util.TemporaryDirectory;
import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.openoffice.FileFormat;
import dk.in2isoft.onlineobjects.openoffice.FileFormatFactory;
import dk.in2isoft.onlineobjects.openoffice.OpenOfficeConverter;
import dk.in2isoft.onlineobjects.service.ServiceController;
import dk.in2isoft.onlineobjects.ui.Request;

public class OoconverterController extends ServiceController {

	//private static Logger log = Logger.getLogger(OoconverterController.class);
	
	public OoconverterController() {
		super();
	}

	@Override
	public void unknownRequest(Request request) throws IOException, EndUserException {
		process(request);
	}



	private void process(Request request) throws IOException, EndUserException {
		String url = request.getString("url","Url is not provided");
		String targetFormat = request.getString("targetformat","Target format not provided");
		String sourceFormat = request.getString("sourceformat","Source format not provided");
		
		url = url.replaceAll(" ", "%20");
		TemporaryDirectory temp = null;
		try {
			temp = TemporaryDirectory.create();
			File tempFile = File.createTempFile("workerbee", "."+sourceFormat, temp.getDirectory());
			downloadFile(url, tempFile);
			convertFile(tempFile, targetFormat, request);
		} catch (IOException e) {
			throw e;
		} finally {
			if (temp != null) {
				temp.clean();
			}
		}
		
	}
	
	


	protected void convertFile(File tempFile, String targetFormat, Request request) throws EndUserException {

		OpenOfficeConverter converter = new OpenOfficeConverter();

		File convertedTempFile = null;
		FileFormat info = FileFormatFactory.getInstance().getByExtension(targetFormat);
		try {
			convertedTempFile = new File(tempFile + "." + info.getExtension());
			String targetFile = "file:///" + convertedTempFile;
			converter.convertDocument(tempFile.toString(), info.getConverter().toString(), targetFile);

			FilePusher pusher = new FilePusher(convertedTempFile);
			pusher.push(request.getResponse(), info.getMimeType().toString());
			// writer.println("Converted to " + convertedTempFile.toURL());
		} catch (Exception e) {
			throw new EndUserException("Problem talking to OpenOffice",e);
		} finally {
			if (tempFile != null)
				tempFile.delete();
			if (convertedTempFile != null)
				convertedTempFile.delete();
		}

	}
	
	private void downloadFile(String url, File tempFile) throws IOException {
		
		FileDownload download = new FileDownload();
		download.download(url, tempFile);
	}

}
