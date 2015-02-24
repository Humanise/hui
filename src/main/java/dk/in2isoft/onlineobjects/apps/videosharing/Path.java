package dk.in2isoft.onlineobjects.apps.videosharing;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface Path {

	String[] start() default {};
	
	String expression() default "";
}
