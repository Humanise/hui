package dk.in2isoft.onlineobjects.modules.pipes;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.util.Map;

public class CSVWriterStage extends PipelineStageAdapter {

	private File file;

	private BufferedWriter writer;

	private String[] keys;

	public CSVWriterStage(File file) {
		this.file = file;
	}

	@Override
	public void receiveMappedLineKeys(String[] keys) throws IOException {
		this.keys = keys;
		BufferedWriter bufferedWriter = getWriter();
		bufferedWriter.write("\"");
		for (int i = 0; i < keys.length; i++) {
			if (i>0) {
				bufferedWriter.write("\",\"");
			}
			bufferedWriter.write(keys[i]);
		}
		bufferedWriter.write("\"");
	}

	@Override
	public void receiveMappedLine(Map<String, String> map) throws IOException {
		BufferedWriter bufferedWriter = getWriter();
		bufferedWriter.newLine();
		bufferedWriter.write("\"");
		for (int i = 0; i < keys.length; i++) {
			if (i>0) {
				bufferedWriter.write("\",\"");
			}
			bufferedWriter.write(map.get(keys[i]));
		}
		bufferedWriter.write("\"");
	}

	private BufferedWriter getWriter() {
		if (writer == null) {
			OutputStreamWriter inputStreamReader;
			try {
				inputStreamReader = new OutputStreamWriter(new FileOutputStream(file), "UTF-8");
				writer = new BufferedWriter(inputStreamReader);
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}
		}
		return writer;
	}

	@Override
	public void cleanUp() {
		context.info(this, "Cleaning");
		if (writer != null) {
			try {
				writer.flush();
				writer.close();
				context.info(this, "Cleaning: writer closed");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

}
