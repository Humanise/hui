package dk.in2isoft.commons.jsf;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Inherited
public @interface Dependencies {

	String[] js() default {};
	String[] css() default {};
	String[] fonts() default {};
	Class<? extends AbstractComponent>[] requires() default {};
	Class<? extends AbstractComponent>[] uses() default {};
}
