package dk.in2isoft.onlineobjects.test.plain;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import junit.framework.TestCase;

import org.junit.Assert;

public class TestRegExp extends TestCase {

	public void test() {

		Pattern pattern = Pattern.compile("\"([0-9]+)x([0-9]+)\"");

		Matcher matcher = pattern.matcher("\"1024x768\"");

		boolean found = false;
		if (matcher.matches()) {
			for (int i = 0; i <= matcher.groupCount(); i++) {
				System.out.println(i + ":" + matcher.group(i));
			}
			System.out.format("I found the text \"%s\" starting at " + "index %d and ending at index %d.%n", matcher
					.group(), matcher.start(), matcher.end());
			found = true;
		}
		if (!found) {
			System.out.format("No match found.%n");
		}
	}
	
	public void testHey() {
		Pattern pattern = Pattern.compile(";jsessionid=[^?]+");		

		String url = "http://photos.onlineobjects.dk:9090/test/en/;jsessionid=35tfzwrw9hre?abc=hjjdshjs&xyz=dsajdhak";
		Matcher matcher = pattern.matcher(url);
		
		Assert.assertTrue(matcher.find());
		
		String replaced = matcher.replaceAll("");
		
		Assert.assertEquals("http://photos.onlineobjects.dk:9090/test/en/?abc=hjjdshjs&xyz=dsajdhak",replaced);
	}
}
