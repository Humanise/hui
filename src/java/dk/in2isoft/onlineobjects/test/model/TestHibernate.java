package dk.in2isoft.onlineobjects.test.model;

import java.util.Iterator;
import java.util.Map;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.persister.entity.EntityPersister;

import dk.in2isoft.onlineobjects.junk.HibernateUtil;
import dk.in2isoft.onlineobjects.test.AbstractTestCase;

public class TestHibernate extends AbstractTestCase {

	private static Logger log = Logger.getLogger(TestHibernate.class);

	@SuppressWarnings("unchecked")
	public void testModelClasses() throws Exception {
		SessionFactory sessionFactory = HibernateUtil.getSessionFactory();
		Map<Object, Object> metadata = sessionFactory.getAllClassMetadata();
		for (Iterator<Object> i = metadata.values().iterator(); i.hasNext();) {
			EntityPersister persister = (EntityPersister) i.next();
			String className = persister.getClassMetadata().getEntityName();
			Class<?> clazz = Class.forName(className);
			log.info(clazz + " with super " + clazz.getSuperclass());
			assertTrue(true);
		}
	}

	@SuppressWarnings("unchecked")
	public void testSelectAnything() throws Exception {
		SessionFactory sessionFactory = HibernateUtil.getSessionFactory();
		Map<Object, Object> metadata = sessionFactory.getAllClassMetadata();
		for (Iterator<Object> i = metadata.values().iterator(); i.hasNext();) {
			Session session = sessionFactory.openSession();
			try {
				EntityPersister persister = (EntityPersister) i.next();
				String className = persister.getClassMetadata().getEntityName();
				log.info(className);
				session.createQuery("from " + className + " c").list();
				assertTrue(true);
			} finally {
				session.close();
			}
		}
	}
}
