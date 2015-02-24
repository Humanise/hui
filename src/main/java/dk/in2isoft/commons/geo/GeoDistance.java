package dk.in2isoft.commons.geo;


public class GeoDistance {
	private double decimal;
	private double degrees;
	private double minutes;
	private double seconds;

	public GeoDistance(double decimal) {
		this.decimal = decimal;
		
		fromDec2DMS();
	}

	public GeoDistance(double degrees, double minutes, double seconds) {
		this.degrees = degrees;
		this.minutes = minutes;
		this.seconds = seconds;

		fromDMS2Dec();
	}
	
	private void fromDec2DMS() {
		// define variables local to this method
		double dfFrac; // fraction after decimal
		double dfSec; // fraction converted to seconds

		// Get degrees by chopping off at the decimal
		degrees = Math.floor(decimal);
		// correction required since floor() is not the same as int()
		if (degrees < 0)
			degrees = degrees + 1;

		// Get fraction after the decimal
		dfFrac = Math.abs(decimal - degrees);

		// Convert this fraction to seconds (without minutes)
		dfSec = dfFrac * 3600;

		// Determine number of whole minutes in the fraction
		minutes = Math.floor(dfSec / 60);

		// Put the remainder in seconds
		seconds = dfSec - minutes * 60;

		// Fix rounoff errors
		if (Math.rint(seconds) == 60) {
			minutes = minutes + 1;
			seconds = 0;
		}

		if (Math.rint(minutes) == 60) {
			if (degrees < 0)
				degrees = degrees - 1;
			else
				// ( dfDegree => 0 )
				degrees = degrees + 1;

			minutes = 0;
		}

		return;
	}
	
	private void fromDMS2Dec() {
		
		// fraction after decimal
		// Determine fraction from minutes and seconds
		double dfFrac = minutes / 60 + seconds / 3600;

		// Be careful to get the sign right. dfDegIn is the only signed input.
		if (degrees < 0)
			decimal = degrees - dfFrac;
		else
			decimal = degrees + dfFrac;

		return;
	}
	
	public double getDecimal() {
		return decimal;
	}
	
	public double getDegrees() {
		return degrees;
	}
	
	public double getMinutes() {
		return minutes;
	}
	
	public double getSeconds() {
		return seconds;
	}

}