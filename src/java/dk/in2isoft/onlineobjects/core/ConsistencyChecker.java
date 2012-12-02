package dk.in2isoft.onlineobjects.core;

import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;

public interface ConsistencyChecker {

	void check() throws ModelException, SecurityException;
}
