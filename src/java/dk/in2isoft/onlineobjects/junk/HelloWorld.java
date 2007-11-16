package dk.in2isoft.onlineobjects.junk;

import java.io.IOException;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;

import dk.in2isoft.onlineobjects.model.Entity;

public class HelloWorld extends HttpServlet {

	private static final long serialVersionUID = 8004620426688162578L;

	@Override
	@SuppressWarnings("unchecked")
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		Session session =  HibernateUtil.getSessionFactory().getCurrentSession();

		session.beginTransaction();

        List<Entity> result = session.createQuery("from Entity").list();

		//assertEquals(result.size(),2);
        Iterator<Entity> i = result.iterator();
        while (i.hasNext()) {
        		Entity e = i.next();
        		response.getWriter().write(e.getName());
        }
		session.getTransaction().commit();
	}

}
