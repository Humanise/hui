package dk.in2isoft.onlineobjects.services;

import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.Node;
import org.neo4j.graphdb.Transaction;
import org.springframework.beans.factory.InitializingBean;

public class DictionaryService implements InitializingBean {

	private GraphDatabaseService database;
	
	public void afterPropertiesSet() throws Exception {
	}

	public void setConfigurationService(ConfigurationService configurationService) {
		//this.configurationService = configurationService;
	}
	
	public void addWord(String word) {
		try (Transaction tx = database.beginTx()) {
			Node node = database.createNode();
			node.setProperty("word", word);
			tx.success();
		}
	}
	
	public Node getWord(String word) {
		try (Transaction tx = database.beginTx()) {
			@SuppressWarnings("deprecation")
			Iterable<Node> nodes = database.getAllNodes();
			for (Node node : nodes) {
				if (node.hasProperty("word")) {
					if (word.equals(node.getProperty("word", word))) {
						return node;
					}
				}
			}
			tx.success();
		}
		return null;
	}
	
	public void shutDown() {
		if (database!=null) {
			database.shutdown();
		}
	}
}
