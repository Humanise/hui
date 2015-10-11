package dk.in2isoft.onlineobjects.ui;

import java.io.IOException;
import java.io.Reader;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.Writer;

import org.mozilla.javascript.ErrorReporter;
import org.mozilla.javascript.EvaluatorException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.yahoo.platform.yui.compressor.JavaScriptCompressor;

public class ScriptCompressor {

	private static final Logger log = LoggerFactory.getLogger(ScriptCompressor.class);

	private ErrorReporter getErrorReporter() {
		ErrorReporter errorReporter = new ErrorReporter() {

			public void warning(String arg0, String arg1, int arg2, String arg3, int arg4) {
				log.warn("Warning: " + arg0 + " / " + arg1 + " / " + arg2 + " / " + arg3 + " / " + arg4);
			}

			public EvaluatorException runtimeError(String arg0, String arg1, int arg2, String arg3, int arg4) {
				log.warn("Runtime error: " + arg0 + " / " + arg1 + " / " + arg2 + " / " + arg3 + " / " + arg4);
				return new EvaluatorException(arg0, arg1, arg2, arg3, arg4);
			}

			public void error(String arg0, String arg1, int arg2, String arg3, int arg4) {
				log.warn("Error: " + arg0 + " / " + arg1 + " / " + arg2 + " / " + arg3 + " / " + arg4);
			}
		};
		return errorReporter;
	}
	
	void compress(Reader in, Writer out) throws EvaluatorException, IOException {
		JavaScriptCompressor compressor = new JavaScriptCompressor(in, getErrorReporter());
		int linebreak = -1;
		boolean munge = true;
		boolean warn = false;
		boolean preserveAllSemiColons = false;
		boolean preserveStringLiterals = false;
		compressor.compress(out, linebreak, munge, warn, preserveAllSemiColons, preserveStringLiterals);		
	}
	
	public String compress(String js) {
		try {
			StringReader in = new StringReader(js);
			StringWriter out = new StringWriter();
			compress(in, out);
			return out.toString();
		} catch (IOException e) {
			return js;
		}
	}
}
