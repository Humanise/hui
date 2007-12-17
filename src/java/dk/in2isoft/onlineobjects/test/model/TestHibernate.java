package dk.in2isoft.onlineobjects.test.model;


import java.util.Iterator;
import java.util.List;

import junit.framework.TestCase;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import dk.in2isoft.onlineobjects.junk.HibernateUtil;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Person;
import dk.in2isoft.onlineobjects.model.Relation;

public class TestHibernate extends TestCase {
	
	private static Logger log = Logger.getLogger(TestHibernate.class);
	
	public void testSomething() {
		Session session = HibernateUtil.getSessionFactory().getCurrentSession();

		session.beginTransaction();

		Person p = new Person();
		p.setGivenName("Jonas");
		p.setFamilyName("Munk");
		assertEquals(p.getName(),"Jonas Munk");
		
		Entity e = new Entity();
		e.setName("a");
		
		log.info(e);
		Relation r = new Relation(p,e);
		
		session.save(p);
		session.save(e);
		session.save(r);
		
		session.getTransaction().commit();
	}
	
	@SuppressWarnings("unchecked")
	public void testListEvents() {
		Session session = HibernateUtil.getSessionFactory().getCurrentSession();

		session.beginTransaction();

        List<Entity> result = session.createQuery("from Entity").list();

		//assertEquals(result.size(),2);
        Iterator<Entity> i = result.iterator();
        while (i.hasNext()) {
        		Entity e = i.next();
        		System.out.println(e.getName());
        }
		session.getTransaction().commit();
	}
}
