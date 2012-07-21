package dk.in2isoft.onlineobjects.services;

import java.util.List;

import dk.in2isoft.onlineobjects.core.ConsistencyChecker;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.SecurityException;

public class ConsistencyService {
	
	private List<ConsistencyChecker> consistencyCheckers;

	public void check() throws ModelException, SecurityException {
		for (ConsistencyChecker consistencyChecker : consistencyCheckers) {
			consistencyChecker.check();
		}
	}
	
	public void setConsistencyCheckers(List<ConsistencyChecker> consistencyCheckers) {
		this.consistencyCheckers = consistencyCheckers;
	}
}
