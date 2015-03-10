package dk.in2isoft.onlineobjects.test.lang;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.logging.Logger;

import org.junit.Test;

public class TestDates {
	
	Logger log = Logger.getGlobal();

	@Test
	public void test() {
		LocalDateTime now = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE;
		formatter = DateTimeFormatter.ofLocalizedDateTime(FormatStyle.FULL,FormatStyle.MEDIUM);
		log.info(now.format(formatter));
	}

}
