package dk.in2isoft.onlineobjects.test;

import junit.framework.TestCase;

import org.springframework.context.support.ClassPathXmlApplicationContext;

public class SpringTestCase extends TestCase {
	
	private ClassPathXmlApplicationContext context;
	
	protected void setUp() throws Exception {
		context = new ClassPathXmlApplicationContext("applicationContext.xml");
	}

	@SuppressWarnings("unchecked")
	public <T> T getBean(Class<T> beanClass) {
		String name = beanClass.getSimpleName().substring(0, 1).toLowerCase()+beanClass.getSimpleName().substring(1);
		return (T) context.getBean(name, beanClass);
	}
}
