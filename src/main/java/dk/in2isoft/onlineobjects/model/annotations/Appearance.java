package dk.in2isoft.onlineobjects.model.annotations;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface Appearance {

	String icon();
}
