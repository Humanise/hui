package dk.in2isoft.onlineobjects.services;

import java.util.List;

import dk.in2isoft.onlineobjects.core.ConsistencyChecker;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;

public class ConsistencyService {
	
	private List<ConsistencyChecker> consistencyCheckers;
	private ConfigurationService configurationService;

	public void check() throws ModelException, SecurityException {
		if (configurationService.isDevelopmentMode()) {
			return;
		}
		for (ConsistencyChecker consistencyChecker : consistencyCheckers) {
			consistencyChecker.check();
		}
	}
	
	public void setConsistencyCheckers(List<ConsistencyChecker> consistencyCheckers) {
		this.consistencyCheckers = consistencyCheckers;
	}
	
	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}
}
