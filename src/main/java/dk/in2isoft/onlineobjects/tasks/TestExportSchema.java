package dk.in2isoft.onlineobjects.tasks;

import org.hibernate.cfg.Configuration;
import org.hibernate.tool.hbm2ddl.SchemaExport;
import org.hibernate.tool.hbm2ddl.SchemaUpdate;
import org.junit.Test;

import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.test.AbstractSpringTask;

public class TestExportSchema extends AbstractSpringTask {
	
	@Test
	public void run() throws ModelException {
		Configuration cfg = new Configuration().configure();
		SchemaExport export = new SchemaExport(cfg);
		export.setOutputFile(getProperty("schema.file"));
		export.execute(false, false, false, false);
		
		SchemaUpdate update = new SchemaUpdate(cfg);
		update.setOutputFile(getProperty("schema.update.file"));
		update.execute(false, false);
	}
}