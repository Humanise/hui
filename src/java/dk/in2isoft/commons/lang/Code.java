package dk.in2isoft.commons.lang;

import java.util.List;

public class Code {
	
	@SuppressWarnings("unchecked")
	public static <T> T cast(Object object) {
		return (T) object;
	}

	@SuppressWarnings("unchecked")
	public static <T> Class<T> castClass(Class<?> object) {
		return (Class<T>) object;
	}

	@SuppressWarnings("unchecked")
	public static <T> List<T> castList(List<?> object) {
		return (List<T>) object;
	}
}
