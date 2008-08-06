package dk.in2isoft.onlineobjects.pipes;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;

public class Pipeline {
	private List<PipelineStage> stages = new ArrayList<PipelineStage>();
	
	private static Logger log = Logger.getLogger(Pipeline.class);
	
	public void addStage(PipelineStage stage) {
		stage.setContext(new PipelineContext(this,stages.size()));
		stages.add(stage);
	}
	
	public void run() {
		stages.get(0).run();
		for (PipelineStage stage : stages) {
			stage.cleanUp();
		}
	}

	PipelineContext createNextContext(PipelineContext pipelineContext) {
		return null;
	}

	public PipelineStage getNextStage(int index) {
		return stages.get(index+1);
	}

	public void warn(PipelineStage stage, String msg) {
		log.warn(stage.getClass().getSimpleName()+" : "+msg);
	}
		
	public void info(PipelineStage stage, String msg) {
		log.info(stage.getClass().getSimpleName()+" : "+msg);
	}
}
