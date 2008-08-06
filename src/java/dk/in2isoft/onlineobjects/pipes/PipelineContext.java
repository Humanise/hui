package dk.in2isoft.onlineobjects.pipes;

import java.io.File;
import java.io.IOException;
import java.util.Map;

public class PipelineContext {

	private Pipeline pipeline;
	private int index;

	public PipelineContext(Pipeline pipeline, int index) {
		super();
		this.pipeline = pipeline;
		this.index = index;
	}
	
	public void forvardFile(File file) {
		PipelineStage next = pipeline.getNextStage(index);
		next.receiveFile(file);
	}
	
	public void forwardMappedLine(Map<String,String> map) {
		PipelineStage next = pipeline.getNextStage(index);
		try {
			next.receiveMappedLine(map);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void info(PipelineStage stage, String msg) {
		pipeline.info(stage, msg);
	}

	public void forwardMappedLineKeys(String[] keys) {
		PipelineStage next = pipeline.getNextStage(index);
		try {
			next.receiveMappedLineKeys(keys);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void warn(PipelineStage stage, String msg) {
		pipeline.warn(stage, msg);
	}
}
