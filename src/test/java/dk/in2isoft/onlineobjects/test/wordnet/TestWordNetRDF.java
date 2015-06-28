package dk.in2isoft.onlineobjects.test.wordnet;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import org.apache.commons.lang.time.StopWatch;
import org.apache.log4j.Logger;
import org.joda.time.Duration;
import org.junit.BeforeClass;
import org.junit.Test;

import com.google.common.collect.Lists;
import com.hp.hpl.jena.graph.Graph;
import com.hp.hpl.jena.graph.Node;
import com.hp.hpl.jena.graph.Triple;
import com.hp.hpl.jena.graph.query.QueryHandler;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import com.hp.hpl.jena.util.iterator.ExtendedIterator;
import com.hp.hpl.jena.vocabulary.RDF;
import com.hp.hpl.jena.vocabulary.RDFS;

import dk.in2isoft.onlineobjects.test.AbstractTestCase;

public class TestWordNetRDF extends AbstractTestCase {

	private static final Logger log = Logger.getLogger(TestWordNetRDF.class);
	private static Model model;
	private static Graph graph;
	private static QueryHandler query;
	private static StopWatch watch;

	private static final Node GLOSSARY = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/gloss");
	private static Node wordURI = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/Word");
	private static Node wordRelation = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/word");
	private static Node lexicalForm = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/lexicalForm");
	private static Node partOfSpeech = Node.createURI("http://www.wordnet.dk/owl/instance/2009/03/schema/partOfSpeech");
	private static final Node CONTAINS_SENSE = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/containsWordSense");
	
	@BeforeClass
	public static void before() throws Exception {
		watch = new StopWatch();
		watch.start();
		model = ModelFactory.createDefaultModel();
		read("words.rdf");
		read("wordsenses.rdf");
		read("glossary.rdf");
		read("part_of_speech.rdf");
		read("synsets.rdf");

		graph = model.getGraph();
		
		query = graph.queryHandler();
	}

	private static void read(String fileName) throws FileNotFoundException, IOException {
		InputStream url = ClassLoader.getSystemResourceAsStream("DanNet-2.1_owl/"+fileName);
		model.read(url, "UTF-8");
		url.close();
		log.info("imported: "+fileName+" : "+new Duration(watch.getTime()));
	}
	
	@Test
	public void testGlossaries() {
		int i = 0;
		ExtendedIterator<Triple> gloss = graph.find(null, GLOSSARY, null);
		while (gloss.hasNext() && i<10) {
			Triple relation = gloss.next();
			Node synset = relation.getSubject();
			print("- synset - objects",Lists.newArrayList(query.objectsFor(synset, null)));
			print("- synset - subjects",Lists.newArrayList(query.subjectsFor(synset, null)));
			print("gloss",relation);
			i++;
		}		
	}
	
	private Node first(ExtendedIterator<Node> iterator) {
		if (iterator.hasNext()) {
			return iterator.next();
		}
		return null;
	}
	
	@Test
	public void testIt() throws Exception {
		
		ExtendedIterator<Triple> words = graph.find(null, RDF.type.asNode(), wordURI);
		{
			int num = 0;
			while (words.hasNext() && num<10) {
				Triple word = (Triple) words.next();
				Node lexicalFormNode = first(query.objectsFor(word.getSubject(), lexicalForm));
				String text = lexicalFormNode.getLiteralLexicalForm();
				if (!"heel".equals(text)) {
					continue;
				}
				print("","");
				print("word",word);
				
				print(" - lexicalForm",lexicalFormNode);
				print(" - partOfSpeech",first(query.objectsFor(word.getSubject(), partOfSpeech)));
				ExtendedIterator<Triple> senses = graph.find(null, wordRelation, word.getSubject());
				while (senses.hasNext()) {
					Triple relation = (Triple) senses.next();
					Node sense = relation.getSubject();
					//print(" - sense",sense);
					Node type = first(query.objectsFor(sense, RDF.type.asNode()));
					print(" - sense - type",type);
					print(" - sense - type - out",Lists.newArrayList(query.objectsFor(type, null)));
					print(" - sense - type - out",Lists.newArrayList(query.subjectsFor(type, null)));
					
					print(" - sense",first(query.objectsFor(sense, RDFS.label.asNode())));
					//print(" - sense - out",Lists.newArrayList(query.objectsFor(sense, null)));
					print(" - sense - out",Lists.newArrayList(graph.find(sense, null, null)));
					ExtendedIterator<Node> synSets = query.subjectsFor(CONTAINS_SENSE, sense);
					while (synSets.hasNext()) {
						Node synset = synSets.next();
						print(" - - synset - out",Lists.newArrayList(query.objectsFor(synset, null)));
						print(" - - synset - glossary",first(query.objectsFor(synset, GLOSSARY)));
						
					}
					//print(" - sense - in",Lists.newArrayList());
				}
				num++;
			}
		}

	}

	protected void print(Object object) {
		System.out.println(object);
	}

	protected void print(String string, Object object) {
		System.out.println(string+": "+object);
	}

}