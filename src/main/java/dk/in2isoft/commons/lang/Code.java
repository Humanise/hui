package dk.in2isoft.commons.lang;

import java.util.Collection;
import java.util.List;

import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;

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

	public static boolean isEmpty(Collection<?> collection) {
		return collection==null || collection.isEmpty();
	}

	public static boolean isNotEmpty(Collection<?> collection) {
		return !isEmpty(collection);
	}

	public static void checkNotEmpty(Collection<?> collection, String message) throws IllegalRequestException {
		if (Code.isEmpty(collection)) {
			throw new IllegalRequestException(message);
		}
	}

	public static void checkNotNull(Object object, String message) throws IllegalRequestException {
		if (object==null) {
			throw new IllegalRequestException(message);
		}
	}
}
