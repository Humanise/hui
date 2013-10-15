package dk.in2isoft.onlineobjects.test.organic;

import org.junit.Test;

import dk.in2isoft.onlineobjects.modules.organic.Cell;
import dk.in2isoft.onlineobjects.modules.organic.ChattyCell;
import dk.in2isoft.onlineobjects.modules.organic.Environment;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestEnvironment extends AbstractSpringTestCase {
	
	@Test
	public void testIt() {
		int beats = 50;
		Environment environment = new Environment();
		for (int i = 0; i < 30; i++) {
			Cell cell = new ChattyCell();
			environment.addCell( cell );
		}
		for (int i = 0; i < beats ; i++) {
			environment.beat();
		}
	}
	
}
