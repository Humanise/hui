package dk.in2isoft.onlineobjects.test.lang;

import java.util.Scanner;
import java.util.StringJoiner;
import java.util.logging.Logger;

import org.junit.Test;

public class TestScanner {
	
	Logger log = Logger.getGlobal();

	@Test
	public void test() {
		StringJoiner joiner = new StringJoiner(" | ");
		
		String str = "Dette er \nen, \ttest";
		try (Scanner scanner = new Scanner(str)) {
			scanner.useDelimiter("[\\W]+");
			while (scanner.hasNext()) {
				joiner.add(scanner.next());				
			}
		}
		log.info(joiner.toString());
	}

}
