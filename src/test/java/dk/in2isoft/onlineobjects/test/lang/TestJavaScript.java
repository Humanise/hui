package dk.in2isoft.onlineobjects.test.lang;

import java.util.Map;
import java.util.logging.Logger;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.junit.Test;

import dk.in2isoft.commons.lang.Code;

public class TestJavaScript {
	
	private static final String NASHORN = "nashorn";
	
	Logger log = Logger.getGlobal();

	@Test
	public void test() throws ScriptException {
		ScriptEngineManager manager = new ScriptEngineManager();
		ScriptEngine engine = manager.getEngineByName(NASHORN);
		
		String script = "var welcome = {x:'Hello'};"
				+ "welcome;";
		Map<String,Object> result = Code.cast(engine.eval(script));
		
		log.info(result.get("x").toString());
	}

}
