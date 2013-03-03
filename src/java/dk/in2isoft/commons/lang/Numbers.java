package dk.in2isoft.commons.lang;

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Locale;

public class Numbers {
	
	public static String formatDecimal(Number number, int deciamls) {
		DecimalFormat format = new DecimalFormat();
		format.setMaximumFractionDigits(deciamls);
		format.setMinimumFractionDigits(deciamls);
		format.setDecimalFormatSymbols(DecimalFormatSymbols.getInstance(Locale.ENGLISH));
		return format.format(number);
	}
}
