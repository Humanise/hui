package dk.in2isoft.commons.jsf;

import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;

import org.apache.commons.lang.StringEscapeUtils;

public class ScriptWriter {
	
	private Writer writer;
	private boolean partial;
	private boolean started;

	public ScriptWriter startScript() throws IOException {
		if (started) {
			throw new IllegalStateException("Script writer already started");
		}
		started = true;
		if (partial) {
			writer.write("<script>");
		}
		return this;
	}

	public ScriptWriter endScript() throws IOException {
		if (!started) {
			throw new IllegalStateException("Script writer not started");
		}
		started = false;
		if (partial) {
			writer.write("</script>");
		}
		return this;
	}
	
	public ScriptWriter() {
		this.writer = new StringWriter();
	}
	
	public ScriptWriter(Writer writer) {
		this.partial = true;
		this.writer = writer;
	}
	
	public ScriptWriter write(Object str) throws IOException {
		if (!started) {
			throw new IllegalStateException("Script writer not started");
		}
		if (str!=null) {
			writer.write(str.toString());
		}
		return this;
	}
	
	@Override
	public String toString() {
		return writer.toString();
	}

	public ScriptWriter line() throws IOException {
		return write("\n");
	}

	public ScriptWriter comma() throws IOException {
		return write(",");
	}

	public ScriptWriter startNewObject(String var, String name) throws IOException {
		return write("var ").write(var).write(" = new ").write(name).write("({");
	}

	public ScriptWriter startNewObject(String name) throws IOException {
		return write("new ").write(name).write("({");
	}

	public ScriptWriter property(String name, String value) throws IOException {
		return write("'").write(name).write("':'").write(StringEscapeUtils.escapeJavaScript(value)).write("'");
	}

	public ScriptWriter startObjectProperty(String name) throws IOException {
		return write("'").write(name).write("':{");
	}

	public ScriptWriter endObjectProperty() throws IOException {
		return write("}");
	}

	public ScriptWriter propertyRaw(String name, String value) throws IOException {
		return write("'").write(name).write("':").write(value);
	}

	public ScriptWriter property(String name, boolean value) throws IOException {
		return write("'").write(name).write("':").write(value);
	}

	public ScriptWriter property(String name, int value) throws IOException {
		return write("'").write(name).write("':").write(value);
	}

	public ScriptWriter property(String name, double value) throws IOException {
		return write("'").write(name).write("':").write(value);
	}


	public ScriptWriter property(String name, Double value) throws IOException {
		return write("'").write(name).write("':").write(value==null ? "null" : value);
	}
	
	public ScriptWriter endNewObject() throws IOException {
		return write("});");
	}

	public ScriptWriter writeScriptString(Object text) throws IOException {
		if (text!=null) {
			writer.write(StringEscapeUtils.escapeJavaScript(text.toString()));
		}
		return this;
	}
}
