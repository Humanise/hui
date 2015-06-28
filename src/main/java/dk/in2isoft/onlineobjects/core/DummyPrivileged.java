package dk.in2isoft.onlineobjects.core;

public class DummyPrivileged implements Privileged {

	private long identity;
	private boolean superUser;
	
	public DummyPrivileged(long identity, boolean superUser) {
		super();
		this.identity = identity;
		this.superUser = superUser;
	}

	@Override
	public long getIdentity() {
		return identity;
	}

	@Override
	public boolean isSuper() {
		return superUser;
	}

}
