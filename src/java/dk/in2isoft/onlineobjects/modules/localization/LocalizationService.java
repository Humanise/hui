package dk.in2isoft.onlineobjects.modules.localization;

import org.joda.time.Period;
import org.joda.time.format.PeriodFormatter;
import org.joda.time.format.PeriodFormatterBuilder;

public class LocalizationService {

	private PeriodFormatter daysHoursMinutes;

	public LocalizationService() {
		daysHoursMinutes = new PeriodFormatterBuilder()
	    .appendDays()
	    .appendSuffix(" day", " days")
	    .appendSeparator(" and ")
	    .appendMinutes()
	    .appendSuffix(" minute", " minutes")
	    .appendSeparator(" and ")
	    .appendSeconds()
	    .appendSuffix(" second", " seconds")
	    .toFormatter();
	}
	
	public String formatMilis(long milis) {
		Period period = new Period(milis).normalizedStandard();
		return daysHoursMinutes.print(period);
	}
}
