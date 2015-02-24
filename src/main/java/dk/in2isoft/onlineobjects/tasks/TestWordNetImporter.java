package dk.in2isoft.onlineobjects.tasks;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.time.StopWatch;
import org.apache.log4j.Logger;
import org.joda.time.Duration;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import com.hp.hpl.jena.graph.Graph;
import com.hp.hpl.jena.graph.Node;
import com.hp.hpl.jena.graph.Triple;
import com.hp.hpl.jena.graph.query.QueryHandler;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import com.hp.hpl.jena.util.iterator.ExtendedIterator;
import com.hp.hpl.jena.vocabulary.RDF;
import com.hp.hpl.jena.vocabulary.RDFS;

import dk.in2isoft.commons.lang.Code;
import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SecurityService;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Language;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.dannet.DanNetGlossary;
import dk.in2isoft.onlineobjects.modules.dannet.DanNetUtil;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.LanguageService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestWordNetImporter extends AbstractSpringTestCase {
	
	private static final Logger log = Logger.getLogger(TestWordNetImporter.class);
	private static Model model;
	private static Graph graph;
	private static QueryHandler query;
	private static StopWatch watch;
	private LanguageService languageService;

	private static final Node GLOSSARY = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/gloss");
	private static Node wordURI = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/Word");
	private static Node wordRelation = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/word");
	private static Node lexicalForm = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/lexicalForm");
	private static Node partOfSpeech = Node.createURI("http://www.wordnet.dk/owl/instance/2009/03/schema/partOfSpeech");
	private static Node hyponymOf = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/hyponymOf");
	private static final Node containsWordSernce = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/containsWordSense");
	
	
	private static final Map<String,String> map = Maps.newHashMap();
	
	{
		map.put("http://www.w3.org/2006/03/wn/wn20/schema/NounWordSense", LexicalCategory.CODE_NOMEN);
		map.put("http://www.w3.org/2006/03/wn/wn20/schema/AdjectiveWordSense", LexicalCategory.CODE_ADJECTIVUM);
		map.put("http://www.w3.org/2006/03/wn/wn20/schema/AdjectiveSatelliteWordSense", LexicalCategory.CODE_ADJECTIVUM);
		map.put("http://www.w3.org/2006/03/wn/wn20/schema/VerbWordSense", LexicalCategory.CODE_VERBUM);
		map.put("http://www.w3.org/2006/03/wn/wn20/schema/AdverbWordSense", LexicalCategory.CODE_ADVERBIUM);
	}

	// Settings...
	private boolean logToSystemOut = true;
	private boolean logModelWarnings = false;
	
	private boolean removeExistingSynonyms = false;
	private Set<String> consideredWords = Sets.newHashSet(); //mand
	private Set<String> disregardedWords = Sets.newHashSet("heel");
	
	// State...
	private Language danish;
	private HashMap<String, LexicalCategory> lexicalCategories;
	private Privileged adminUser;
	private User publicUser;
	
	@BeforeClass
	public static void beforeClass() throws Exception {
		watch = new StopWatch();
		watch.start();
		model = ModelFactory.createDefaultModel();
		read("words.rdf");
		read("wordsenses.rdf");
		read("glossary.rdf");
		read("part_of_speech.rdf");
		read("synsets.rdf");
		read("nearSynonymOf.rdf");
		read("instanceOf.rdf");
		read("instanceOf_taxonomic.rdf");
		read("instanceOf.rdf");
		read("instanceOf_taxonomic.rdf");
		read("hyponymOf.rdf");
		read("hypernymOf.rdf");
		read("domain.rdf");

		graph = model.getGraph();
		
		query = graph.queryHandler();
		
	}
	
	@Before
	public void setup() throws Exception {

		danish = languageService.getLanguageForCode("da");
		lexicalCategories = Maps.newHashMap();
		List<LexicalCategory> list = modelService.list(Query.after(LexicalCategory.class));
		for (LexicalCategory lexicalCategory : list) {
			lexicalCategories.put(lexicalCategory.getCode(), lexicalCategory);
		}
		adminUser = modelService.getUser(SecurityService.ADMIN_USERNAME);
		publicUser = modelService.getUser(SecurityService.PUBLIC_USERNAME);
	}
	
	@Test
	public void testIt() throws Exception {
		
		
		int total = Lists.newArrayList(graph.find(null, RDF.type.asNode(), wordURI)).size();

		int start = (int) (((float)total)*.6f);
		//start = 0;
		log.info("Total = "+total);
		log.info("Starting at "+start);
		
		// Loop through all words
		ExtendedIterator<Triple> words = graph.find(null, RDF.type.asNode(), wordURI);
		{
			int num = 0;
			while (words.hasNext()) {
				num++;
				Triple triple = (Triple) words.next();
				if (num < start) continue;
				Node word = triple.getSubject();
				Node lexNode = first(query.objectsFor(word, lexicalForm));
				String text = lexNode.getLiteralLexicalForm();
				
				// Filter words
				if (Code.isNotEmpty(consideredWords) && !consideredWords.contains(text)) {
					continue;
				}
				
				if (disregardedWords.contains(text)) {
					continue;
				}

				print("·····················");
				print("word",word);
				print(" · lexicalForm",lexNode);
				print(" · partOfSpeech",first(query.objectsFor(word, partOfSpeech)));
				print("");
				
				
				ExtendedIterator<Triple> senses = graph.find(null, wordRelation, word);
				while (senses.hasNext()) {
					

					
					Triple relation = (Triple) senses.next();
					Node sense = relation.getSubject();
					print(" - sense",sense);
					
					Node type = first(query.objectsFor(sense, RDF.type.asNode()));
					
					String label = getLabel(sense);
					
					
					Word localWord = findLocalWord(sense, label);
					
					// Lexical category...
					updateCategory(type, localWord);
					
					// Language...
					updateLanguage(danish, localWord);
					
					
					print(" - sense - label",label);
					print(" - sense - out",getRelations(sense, null));
					print(" - sense - in",getRelations(null, sense));
					
					ExtendedIterator<Node> synSets = query.subjectsFor(containsWordSernce, sense);
					while (synSets.hasNext()) {
						Node synset = synSets.next();
						
						// TODO Enable this again
						//updateWordProperties(localWord, synset);
						
						
						if (removeExistingSynonyms) {
							removeExistingSynonyms(localWord);
						}
						

						print(" - sense - synset", getSimpleURI(synset));
						print(" - sense - synset - out", getRelations(synset, null));
						print(" - sense - synset - in", getRelations(null, synset));
						
						ExtendedIterator<Node> hyponyms = query.objectsFor(synset, hyponymOf);
						while (hyponyms.hasNext()) {
							Node hyponymSynset = hyponyms.next();
							print(" - sense - synset - hyponym", getSimpleURI(hyponymSynset));
							print(" - sense - synset - hyponym - label", getLabel(hyponymSynset));
							ExtendedIterator<Node> sensesOfHyponymSynset = query.objectsFor(hyponymSynset,containsWordSernce);
							while (sensesOfHyponymSynset.hasNext()) {
								Node senseOfHyponym = (Node) sensesOfHyponymSynset.next();
								print(" - sense - synset - hyponym - sense - label", getLabel(senseOfHyponym));
								createGeneralization(localWord, senseOfHyponym);
							}
							
						}
						
						ExtendedIterator<Node> wordsInSynset = query.objectsFor(synset, containsWordSernce);
						int numberOfSensesInSynset = 0;
						while (wordsInSynset.hasNext()) {
							Node wordsenseOfSynset = wordsInSynset.next();
							if (wordsenseOfSynset.getURI().equals(sense.getURI())) {
								continue; // Skip existing
							}
							print(" - sense - synset - sense", getSimpleURI(wordsenseOfSynset));
							String wordsenseOfSynsetLabel = getLabel(wordsenseOfSynset);
							print(" - sense - synset - sense - label", wordsenseOfSynsetLabel);
							print(" - sense - synset - sense - out", getRelations(wordsenseOfSynset, null));
							print(" - sense - synset - sense - in", getRelations(null, wordsenseOfSynset));
							
							createSynonym(localWord, wordsenseOfSynset);
							
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

	private void createSynonym(Word localWord, Node sense) throws ModelException {
		createRelation(localWord, sense, Relation.KIND_SEMANTICS_SYNONYMOUS, true);
	}

	private void createGeneralization(Word localWord, Node sense) throws ModelException {
		createRelation(localWord, sense, Relation.KIND_SEMANTICS_GENRALTIZATION, false);
	}
	
	private void createRelation(Word localWord, Node sense, String kind, boolean down) throws ModelException {
		String label = getLabel(sense);
		if (Strings.isBlank(label)) {
			print("Will not create relation since the label is null : " + getSimpleURI(sense));
			return;
		}
		Word foundSynonym = findWord(label, sense.getURI());
		if (foundSynonym!=null) {
			List<Word> existingSynonyms;
			if (down) {
				existingSynonyms = modelService.getChildren(localWord, kind,Word.class, adminUser);
			} else {
				existingSynonyms = modelService.getParents(localWord, kind,Word.class, adminUser);
			}
			for (Word existing : existingSynonyms) {
				if (existing.getId()==foundSynonym.getId()) {
					return;
				}
			}
			if (existingSynonyms.size()>0) {
				print("Something new happened!");
			}
			if (down) {
				modelService.createRelation(localWord, foundSynonym, kind, publicUser);
			} else {
				modelService.createRelation(foundSynonym, localWord, kind, publicUser);
			}
			modelService.commit();
		} else {
			print("Unable to find existing sense");
		}
		
	}

	private String getLabel(Node node) {
		Node first = first(query.objectsFor(node, RDFS.label.asNode()));
		if (first==null) {
			return null;
		}
		return first.getLiteralLexicalForm();
	}

	private String getRelations(Node subject, Node object) {
		ExtendedIterator<Triple> iterator = graph.find(subject, null, object);
		StringBuilder sb = new StringBuilder();
		while (iterator.hasNext()) {
			Triple triple = (Triple) iterator.next();
			Node other = subject==null ? triple.getSubject() : triple.getObject();
			sb.append(" { ").append(getSimpleURI(triple.getPredicate())).append(" » ").append(getSimpleURI(other)).append(" } ");
		}
		return sb.toString();
	}

	private String getSimpleURI(Node node) {
		if (node.isURI()) {
			String uri = node.getURI();
			int index = uri.lastIndexOf("/");
			if (index>-1) {
				return uri.substring(index+1);
			}
			return uri;
		}
		return node.toString();
	}

	private void removeExistingSynonyms(Word localWord) throws ModelException, SecurityException {
		List<Relation> synonyms = modelService.getChildRelations(localWord, Word.class);
		for (Relation synonym : synonyms) {
			if (!Relation.KIND_SEMANTICS_SYNONYMOUS.equals(synonym.getKind())) {
				modelService.deleteRelation(synonym, getPublicUser());
			}
		}
	}

	private void updateWordProperties(Word localWord, Node synset) throws SecurityException, ModelException {
		Node glossary = first(query.objectsFor(synset, GLOSSARY));
		if (glossary!=null) {
			print(" - sense - synset - glossary",glossary.getLiteralLexicalForm());
		}
		DanNetGlossary parsed = DanNetUtil.parseGlossary(glossary.getLiteralLexicalForm());
		localWord.removeProperties(Property.KEY_SEMANTICS_GLOSSARY);
		localWord.removeProperties(Property.KEY_SEMANTICS_EXAMPLE);
		
		if (Strings.isNotBlank(parsed.getGlossary())) {
			localWord.addProperty(Property.KEY_SEMANTICS_GLOSSARY, parsed.getGlossary());
		}
		for (String example : parsed.getExamples()) {
			localWord.addProperty(Property.KEY_SEMANTICS_EXAMPLE, example);
		}
		modelService.updateItem(localWord, getPublicUser());
		modelService.commit();
	}

	private Word findLocalWord(Node sense, String label) throws ModelException {
		Word localWord = findWord(label, sense.getURI());
		if (localWord==null) {
			localWord = new Word();
			localWord.setText(label);
			localWord.addProperty(Property.KEY_DATA_SOURCE, sense.getURI());
			modelService.createItem(localWord, getPublicUser());
		} else {
			print("found",localWord);
		}
		return localWord;
	}

	private void updateCategory(Node type, Word localWord) throws ModelException {
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
		} else if (logModelWarnings) {
			log.error("Already categorized: "+lexicalCategory.getCode());
		}
	}

	private void updateLanguage(Entity danish, Word localWord) throws ModelException {
		Language language = modelService.getParent(localWord, Language.class);
		if (language==null) {
			modelService.createRelation(danish, localWord, getPublicUser());
			modelService.commit();
		} else if (logModelWarnings) {
			log.error("Language exists: "+language.getName());
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

	private static void read(String fileName) throws FileNotFoundException, IOException {
		FileReader reader = new FileReader(new File("/Users/jbm/Udvikling/Workspace/onlineobjects/testdata/DanNet-2.1_owl/"+fileName));
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

	protected void print(Object object) {
		if (logToSystemOut) {
			System.out.println(object);
		} else {
			log.info(object);
		}
	}

	protected void print(String string, Object object) {
		String out = string+": "+object;
		if (logToSystemOut) {
			System.out.println(out);
		} else {
			log.info(out);
		}
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