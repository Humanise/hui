package dk.in2isoft.onlineobjects.modules.index;

import dk.in2isoft.onlineobjects.modules.scheduling.JobStatus;

public interface Indexer {

	void rebuild(JobStatus status);
}
