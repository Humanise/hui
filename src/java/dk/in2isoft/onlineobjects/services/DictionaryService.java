package dk.in2isoft.onlineobjects.services;

import java.io.File;

import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.Node;
import org.neo4j.graphdb.Transaction;
import org.neo4j.graphdb.TransactionFailureException;
import org.neo4j.index.lucene.LuceneIndexService;
import org.neo4j.kernel.EmbeddedGraphDatabase;
import org.springframework.beans.factory.InitializingBean;

public class DictionaryService implements InitializingBean {

	private LuceneIndexService index;

	private ConfigurationService configurationService;

	private GraphDatabaseService database;
	
	public void afterPropertiesSet() throws Exception {
		File storageDir = configurationService.getStorageDir();
		File file = new File(storageDir,"dictionary.db");
		try {
			//database = new EmbeddedGraphDatabase(file.getAbsolutePath());
			//index = new LuceneIndexService( database );
		} catch (TransactionFailureException e) {
			
		}
	}

	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}
	
	public void addWord(String word) {
		Transaction tx = database.beginTx();
		try {
			Node node = database.createNode();
			node.setProperty("word", word);
			index.index(node, "word", word);
			tx.success();
		} finally {
			tx.finish();
		}
	}
	
	public Node getWord(String word) {
		Transaction tx = database.beginTx();
		try {
			Iterable<Node> nodes = database.getAllNodes();
			for (Node node : nodes) {
				if (node.hasProperty("word")) {
					if (word.equals(node.getProperty("word", word))) {
						return node;
					}
				}
			}
			tx.success();
		} finally {
			tx.finish();
		}
		return null;
		/*
		Node result = null;
		Transaction tx = database.beginTx();
		try {
			result = index.getSingleNode("word", word);
			tx.success();
		} finally {
			tx.finish();
			database.shutdown();
		}
		return result;*/
	}
	
	public void shutDown() {
		if (database!=null) {
			database.shutdown();
		}
	}
}
