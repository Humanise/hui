package dk.in2isoft.onlineobjects.apps.developer.views;

import java.util.Date;

import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;

public class ComponentTestView extends AbstractManagedBean implements InitializingBean {
	

	public void afterPropertiesSet() throws Exception {
	}

	public Date getDate() {
		return new Date();
	}
}
