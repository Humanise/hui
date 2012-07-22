package dk.in2isoft.onlineobjects.core;

public interface ConsistencyChecker {

	void check() throws ModelException, SecurityException;
}
