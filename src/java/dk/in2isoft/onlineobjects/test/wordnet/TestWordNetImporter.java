package dk.in2isoft.onlineobjects.test.wordnet;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.time.StopWatch;
import org.apache.log4j.Logger;
import org.joda.time.Duration;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.hp.hpl.jena.graph.Graph;
import com.hp.hpl.jena.graph.Node;
import com.hp.hpl.jena.graph.Triple;
import com.hp.hpl.jena.graph.query.QueryHandler;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import com.hp.hpl.jena.util.iterator.ExtendedIterator;
import com.hp.hpl.jena.vocabulary.RDF;
import com.hp.hpl.jena.vocabulary.RDFS;

import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.dannet.DanNetGlossary;
import dk.in2isoft.onlineobjects.modules.dannet.DanNetUtil;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.LanguageService;
import dk.in2isoft.onlineobjects.services.SemanticService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestWordNetImporter extends AbstractSpringTestCase {
	
	private ConfigurationService configurationService; 

	private static final Logger log = Logger.getLogger(TestWordNetImporter.class);
	private static Model model;
	private static Graph graph;
	private static QueryHandler query;
	private static StopWatch watch;

	private static final Node GLOSSARY = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/gloss");
	private static Node wordURI = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/Word");
	private static Node wordRelation = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/word");
	private static Node lexicalForm = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/lexicalForm");
	private static Node partOfSpeech = Node.createURI("http://www.wordnet.dk/owl/instance/2009/03/schema/partOfSpeech");
	private static Node nearSynonymOf = Node.createURI("http://www.wordnet.dk/owl/instance/2009/03/schema/nearSynonymOf");
	private static final Node CONTAINS_SENSE = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/containsWordSense");
	
	private static final Map<String,String> map = Maps.newHashMap();
	
	{
		map.put("http://www.w3.org/2006/03/wn/wn20/schema/NounWordSense", LexicalCategory.CODE_NOMEN);
		map.put("http://www.w3.org/2006/03/wn/wn20/schema/AdjectiveWordSense", LexicalCategory.CODE_ADJECTIVUM);
		map.put("http://www.w3.org/2006/03/wn/wn20/schema/AdjectiveSatelliteWordSense", LexicalCategory.CODE_ADJECTIVUM);
		map.put("http://www.w3.org/2006/03/wn/wn20/schema/VerbWordSense", LexicalCategory.CODE_VERBUM);
		map.put("http://www.w3.org/2006/03/wn/wn20/schema/AdverbWordSense", LexicalCategory.CODE_ADVERBIUM);
	}
	
	private SemanticService semanticService;
	private LanguageService languageService;
	
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
		read("nearSynonymOf.rdf");

		graph = model.getGraph();
		
		query = graph.queryHandler();
	}

	private static void read(String fileName) throws FileNotFoundException, IOException {
		FileReader reader = new FileReader(new File("/Users/jbm/Udvikling/Workspace/OnlineObjects/testdata/DanNet-2.1_owl/"+fileName));
		model.read(reader, "UTF-8");
		reader.close();
		log.info("imported: "+fileName+" : "+new Duration(watch.getTime()));
	}
	
	private Node first(ExtendedIterator<Node> iterator) {
		if (iterator.hasNext()) {
			return iterator.next();
		}
		return null;
	}
	
	@Test
	public void testIt() throws Exception {
		
		Entity danish = languageService.getLanguageForCode("da");
		Map<String,LexicalCategory> lexicalCategories = Maps.newHashMap();
		List<LexicalCategory> list = modelService.list(Query.after(LexicalCategory.class));
		for (LexicalCategory lexicalCategory : list) {
			lexicalCategories.put(lexicalCategory.getCode(), lexicalCategory);
		}
		
		int total = Lists.newArrayList(graph.find(null, RDF.type.asNode(), wordURI)).size();

		int start = (int) (((float)total)*.6f);
		start = 0;
		log.info("Total = "+total);
		log.info("Starting at "+start);
		ExtendedIterator<Triple> words = graph.find(null, RDF.type.asNode(), wordURI);
		{
			int num = 0;
			while (words.hasNext()) {
				num++;
				Triple word = (Triple) words.next();
				if (num < start) continue;
				Node lexNode = first(query.objectsFor(word.getSubject(), lexicalForm));
				String text = lexNode.getLiteralLexicalForm();
				
				if (!"mand".equals(text)) {
					//continue;
				}
				
				if ("heel".equals(text)) {
					continue;
				}

				print("-------------------------------------");
				print("word",word);
				print(" - lexicalForm",lexNode);
				print(" - partOfSpeech",first(query.objectsFor(word.getSubject(), partOfSpeech)));
				ExtendedIterator<Triple> senses = graph.find(null, wordRelation, word.getSubject());
				while (senses.hasNext()) {
					Triple relation = (Triple) senses.next();
					Node sense = relation.getSubject();
					Node type = first(query.objectsFor(sense, RDF.type.asNode()));
					
					String label = first(query.objectsFor(sense, RDFS.label.asNode())).getLiteralLexicalForm();
					
					Word localWord = findWord(label, sense.getURI());
					if (localWord==null) {
						localWord = new Word();
						localWord.setText(label);
						localWord.addProperty(Property.KEY_DATA_SOURCE, sense.getURI());
						modelService.createItem(localWord, getPublicUser());
					} else {
						print("found",localWord);
					}
					
					// Lexical category...
					LexicalCategory lexicalCategory = modelService.getParent(localWord, LexicalCategory.class);
					if (lexicalCategory==null) {
						String code = map.get(type.getURI());
						if (code!=null) {
							lexicalCategory = lexicalCategories.get(code);
							if (lexicalCategory!=null) {
								modelService.createRelation(lexicalCategory, localWord, getPublicUser());
								modelService.commit();
							}
						} else {
							log.error("Code not found: "+type.getURI());
						}
					} else {
						log.error("Already categorized: "+lexicalCategory.getCode());
					}
					
					// Language...
					Language language = modelService.getParent(localWord, Language.class);
					if (language==null) {
						modelService.createRelation(danish, localWord, getPublicUser());
						modelService.commit();
					} else {
						log.error("Language exists: "+language.getName());
					}
					
					
					print(" - sense",label);
					print(" - sense - out",Lists.newArrayList(query.objectsFor(sense, null)));
					print(" - sense - in",Lists.newArrayList(graph.find(null, null, sense)));
					ExtendedIterator<Node> synSets = query.subjectsFor(CONTAINS_SENSE, sense);
					while (synSets.hasNext()) {
						Node synset = synSets.next();
						Node glossary = first(query.objectsFor(synset, GLOSSARY));
						if (glossary!=null) {
							print(" - sense - synset - glossary",glossary.getLiteralLexicalForm());
						}
						DanNetGlossary parsed = DanNetUtil.parseGlossary(glossary.getLiteralLexicalForm());
						localWord.removeProperties(Property.KEY_SEMANTICS_GLOSSARY);
						localWord.removeProperties(Property.KEY_SEMANTICS_EXAMPLE);
						localWord.addProperty(Property.KEY_SEMANTICS_GLOSSARY, parsed.getGlossary());
						for (String example : parsed.getExamples()) {
							localWord.addProperty(Property.KEY_SEMANTICS_EXAMPLE, example);
						}
						modelService.updateItem(localWord, getPublicUser());
						
						// remove existing synonyms
						/*
						List<Relation> synonyms = modelService.getChildRelations(localWord, Word.class);
						for (Relation synonym : synonyms) {
							if (!Relation.KIND_SEMANTICS_SYNONYMOUS.equals(synonym.getKind())) {
								modelService.deleteRelation(synonym, getPublicUser());
							}
						}*/
						

						print(" - sense - synset - out",Lists.newArrayList(query.objectsFor(synset, null)));
						print(" - sense - synset - in",Lists.newArrayList(graph.find(null, null, synset)));
						
						ExtendedIterator<Node> wordsInSynset = query.objectsFor(synset, CONTAINS_SENSE);
						int numberOfSensesInSynset = 0;
						while (wordsInSynset.hasNext()) {
							Node wordsenseOfSynset = wordsInSynset.next();
							if (wordsenseOfSynset.getURI().equals(sense.getURI())) {
								continue; // Skip existing
							}
							print(" - sense - synset - sense", wordsenseOfSynset);
							String wordsenseOfSynsetLabel = first(query.objectsFor(wordsenseOfSynset, RDFS.label.asNode())).getLiteralLexicalForm();
							print(" - sense - synset - sense - label",wordsenseOfSynsetLabel);
							print(" - sense - synset - sense - out",Lists.newArrayList(graph.find(wordsenseOfSynset, null, null)));
							print(" - sense - synset - sense - in",Lists.newArrayList(graph.find(null, null, wordsenseOfSynset)));
							Word foundSynonym = findWord(wordsenseOfSynsetLabel, wordsenseOfSynset.getURI());
							if (foundSynonym!=null) {
								createSynonym(localWord,foundSynonym);
							} else {
								print("Unable to find existing sense");
							}
							numberOfSensesInSynset++;
						}
						if (numberOfSensesInSynset > 4) {
							print("Found more than 4 senses : "+numberOfSensesInSynset);
						}
					}
					//print(" - sense - in",Lists.newArrayList());
					modelService.commit();
				}
				log.info((Math.round((float) num)/((float) total)*100)+"%");
			}
		}

	}
	
	private void createSynonym(Word localWord, Word foundSynonym) throws ModelException {
		Word existingSynonym = modelService.getChild(localWord, Relation.KIND_SEMANTICS_SYNONYMOUS,Word.class);
		if (existingSynonym==null) {
			modelService.createRelation(localWord, foundSynonym, Relation.KIND_SEMANTICS_SYNONYMOUS, getPublicUser());
		}
	}

	private Word findWord(String text, String sourceId) {
		List<Word> list = modelService.list(Query.after(Word.class).withField(Word.TEXT_FIELD, text));
		for (Word word : list) {
			if (word.getPropertyValues(Property.KEY_DATA_SOURCE).contains(sourceId)) {
				return word;
			}
		}
		return null;
	}

	protected void print(Object object) {
		log.info(object);
	}

	protected void print(String string, Object object) {
		log.info(string+": "+object);
	}

	@Autowired
	public void setSemanticService(SemanticService semanticService) {
		this.semanticService = semanticService;
	}
	
	@Autowired
	public void setLanguageService(LanguageService languageService) {
		this.languageService = languageService;
	}
	
	@Override
	public void setConfigurationService(ConfigurationService configurationService) {
		super.setConfigurationService(configurationService);
	}
}