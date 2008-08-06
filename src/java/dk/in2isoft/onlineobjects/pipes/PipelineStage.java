package dk.in2isoft.onlineobjects.pipes;

import java.io.File;
import java.io.IOException;
import java.util.Map;

public interface PipelineStage {
	
	public void run();

	public void receiveFile(File file);

	public void receiveMappedLine(Map<String, String> map) throws IOException;

	public void receiveMappedLineKeys(String[] keys) throws IOException;

	public void setContext(PipelineContext pipelineContext);
	
	public void cleanUp();
}
