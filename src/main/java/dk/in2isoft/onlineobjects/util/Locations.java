package dk.in2isoft.onlineobjects.util;

import java.text.DecimalFormat;

import dk.in2isoft.commons.geo.GeoDistance;
import dk.in2isoft.commons.lang.Strings;

public class Locations {

	private static DecimalFormat format;
	static {
		format = new DecimalFormat();
		format.setMinimumFractionDigits(0);
		format.setMaximumFractionDigits(2);		
	}
	
	public static String formatLatitude(double latitude) {

		GeoDistance distance = new GeoDistance(Math.abs(latitude));
		StringBuilder sb = new StringBuilder();
		sb.append(format.format(distance.getDegrees()));
		sb.append(Strings.DEGREE).append(" ");
		sb.append(format.format(distance.getMinutes()));
		sb.append(Strings.RIGHT_SINGLE_QUOTE).append(" ");
		sb.append(format.format(distance.getSeconds()));
		sb.append(Strings.DOUBLE_APOSTROPHE);
		sb.append(latitude>0 ? " North" : " South");
		
		return sb.toString();
	}

	public static String formatLongitude(double longitude) {

		GeoDistance distance = new GeoDistance(Math.abs(longitude));
		StringBuilder sb = new StringBuilder();
		sb.append(format.format(distance.getDegrees()));
		sb.append(Strings.DEGREE).append(" ");
		sb.append(format.format(distance.getMinutes()));
		sb.append(Strings.RIGHT_SINGLE_QUOTE).append(" ");
		sb.append(format.format(distance.getSeconds()));
		sb.append(Strings.DOUBLE_APOSTROPHE);
		sb.append(longitude>0 ? " East" : " West");
		
		return sb.toString();
	}
}
