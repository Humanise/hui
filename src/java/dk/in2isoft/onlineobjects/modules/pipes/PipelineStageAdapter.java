package dk.in2isoft.onlineobjects.modules.pipes;

import java.io.File;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

public abstract class PipelineStageAdapter implements PipelineStage {

	protected PipelineContext context;

	public PipelineStageAdapter() {
	}
	
	public void setContext(PipelineContext context) {
		this.context = context;
	}

	public void receiveFile(File file) {
		throw new UnsupportedOperationException("This stage does not support importing files");
	}

	public void receiveMappedLine(Map<String, String> map) throws IOException {
		throw new UnsupportedOperationException("This stage does not support mapped lines");
	}
	
	public void receiveResultSet(ResultSet rs) throws SQLException {
		throw new UnsupportedOperationException("This stage does not support result sets");
	}

	public void receiveMappedLineKeys(String[] keys) throws IOException {
		throw new UnsupportedOperationException("This stage does not support mapped lines");
	}

	public void run() {
		throw new UnsupportedOperationException("This stage does not support starting from scratch");
	}

	public void cleanUp() {
			
	}
	
}
