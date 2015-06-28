package dk.in2isoft.onlineobjects.modules.pipes;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Map;

public class LoggingStage extends PipelineStageAdapter {

	public LoggingStage() {

	}

	@Override
	public void receiveFile(File file) {
		context.info(this, file.getAbsolutePath());
		context.forvardFile(file);
	}

	@Override
	public void receiveMappedLine(Map<String, String> map) {
		context.info(this, map.toString());
		context.forwardMappedLine(map);
	}

	@Override
	public void receiveMappedLineKeys(String[] keys) throws IOException {
		context.info(this, Arrays.toString(keys));
		context.forwardMappedLineKeys(keys);
	}
}
