package dk.in2isoft.onlineobjects.test.data;

import java.io.File;

import org.apache.log4j.Logger;
import org.junit.Ignore;
import org.junit.Test;
import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.Node;
import org.neo4j.graphdb.ReturnableEvaluator;
import org.neo4j.graphdb.StopEvaluator;
import org.neo4j.graphdb.Transaction;
import org.neo4j.graphdb.TraversalPosition;
import org.neo4j.graphdb.Traverser.Order;
import org.neo4j.kernel.EmbeddedGraphDatabase;
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
		GraphDatabaseService graphDb = new EmbeddedGraphDatabase(file.getAbsolutePath());
		Transaction tx = graphDb.beginTx();
		try
		{
		   Node firstNode = graphDb.createNode();
		   firstNode.setProperty("word", "albert");
		   firstNode.setProperty("kind", "name");
		   tx.success();
		}
		finally
		{
		   tx.finish();
		   graphDb.shutdown();
		}


	}
	
	@Test @Ignore
	public void testSearch() {
		File storageDir = configurationService.getStorageDir();
		File file = new File(storageDir,"words.db");
		GraphDatabaseService graphDb = new EmbeddedGraphDatabase(file.getAbsolutePath());
		Transaction tx = graphDb.beginTx();
		try
		{
			Iterable<Node> allNodes = graphDb.getAllNodes();
			graphDb.getReferenceNode().traverse(Order.BREADTH_FIRST, StopEvaluator.END_OF_GRAPH, new ReturnableEvaluator() {
				
				public boolean isReturnableNode(TraversalPosition pos) {
					// TODO Auto-generated method stub
					return pos.currentNode().hasProperty("word");
				}
			});
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
		   tx.finish();
		   graphDb.shutdown();
		}


	}
	
	@Override
	public void setConfigurationService(ConfigurationService configurationService) {
		// TODO Auto-generated method stub
		super.setConfigurationService(configurationService);
	}
}
