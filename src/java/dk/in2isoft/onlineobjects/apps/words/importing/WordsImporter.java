package dk.in2isoft.onlineobjects.apps.words.importing;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Map;

import org.apache.commons.io.IOUtils;

import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.importing.ImportTransport;
import dk.in2isoft.onlineobjects.modules.importing.ImportListener;
import dk.in2isoft.onlineobjects.modules.importing.ImportSession.Status;
import dk.in2isoft.onlineobjects.ui.Request;

public class WordsImporter implements ImportListener<Word>,ImportTransport,TextImporter {

	private Status status = Status.waiting;
	private String text;
	private String title;
	
	public String getProcessName() {
		return "wordsImport";
	}

	public void processFile(File file, String mimeType, String name, Map<String, String> parameters, Request request) throws IOException, EndUserException {
		status = Status.transferring;
		FileInputStream stream = new FileInputStream(file);
		text = IOUtils.toString(stream,"UTF-8");
		title = name;
		IOUtils.closeQuietly(stream);
		status = Status.success;
	}
	
	@Override
	public Word getResponse() {
		return null;
	}

	public Status getStatus() {
		return status;
	}

	public void start() {
		
	}
	
	public Object getResult() {
		return null;
	}

	public String getText() {
		return text;
	}

	public String getTitle() {
		return title;
	}
}
