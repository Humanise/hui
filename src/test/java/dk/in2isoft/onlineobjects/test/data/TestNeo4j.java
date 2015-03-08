package dk.in2isoft.onlineobjects.test.data;

import java.io.File;

import org.apache.log4j.Logger;
import org.junit.Ignore;
import org.junit.Test;
import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.Node;
import org.neo4j.graphdb.Transaction;
import org.neo4j.graphdb.factory.GraphDatabaseFactory;
import org.neo4j.graphdb.traversal.TraversalDescription;
import org.neo4j.kernel.impl.traversal.MonoDirectionalTraversalDescription;
import org.neo4j.tooling.GlobalGraphOperations;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestNeo4j extends AbstractSpringTestCase {
	
	private static Logger log = Logger.getLogger(TestNeo4j.class);
	
	@Autowired
	private ConfigurationService configurationService;

	@Test
	public void testSetup() {
		File storageDir = configurationService.getStorageDir();
		File file = new File(storageDir,"test.db");
		GraphDatabaseService graphDb = new GraphDatabaseFactory().newEmbeddedDatabase(file.getAbsolutePath());
		try (Transaction tx = graphDb.beginTx())
		{
		   Node firstNode = graphDb.createNode();
		   firstNode.setProperty("word", "albert");
		   firstNode.setProperty("kind", "name");
		   tx.success();
		}
		finally
		{
		   graphDb.shutdown();
		}


	}
	
	@Test @Ignore
	public void testSearch() {
		File storageDir = configurationService.getStorageDir();
		File file = new File(storageDir,"words.db");
		GraphDatabaseService graphDb = new GraphDatabaseFactory().newEmbeddedDatabase(file.getAbsolutePath());
		try (Transaction tx = graphDb.beginTx())
		{
			GlobalGraphOperations operations = GlobalGraphOperations.at(graphDb);
			Iterable<Node> allNodes = operations.getAllNodes();
			TraversalDescription td = new MonoDirectionalTraversalDescription();
			td.breadthFirst();
			for (Node node : allNodes) {
				log.info("ID: "+node.getId());
				if (node.hasProperty("word")) {
					log.info(node.getProperty("word"));
				}
			}
			tx.success();
		}
		finally
		{
		   graphDb.shutdown();
		}


	}
	
	@Override
	public void setConfigurationService(ConfigurationService configurationService) {
		// TODO Auto-generated method stub
		super.setConfigurationService(configurationService);
	}
}
