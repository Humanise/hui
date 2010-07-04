package dk.in2isoft.commons.jsf;

public class ScriptBuilder {

	StringBuilder sb;
	
	public ScriptBuilder() {
		this.sb = new StringBuilder();
	}
	
	public ScriptBuilder startNew(String name) {
		sb.append("new ").append(name).append("(");
		return this;
	}

	public ScriptBuilder startObject() {
		sb.append("{");
		return this;
	}
}
