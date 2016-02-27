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
import dk.in2isoft.onlineobjects.modules.index.WordIndexer;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.LanguageService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTask;

public class TestDanNetImporter extends AbstractSpringTask {
	
	private static final String PATH = "/Users/jbm/Udvikling/Workspace/onlineobjects/src/test/resources/DanNet-2.1_owl/";
	private static final Logger log = Logger.getLogger(TestDanNetImporter.class);
	private static Graph graph;
	private static QueryHandler query;
	private static StopWatch watch;
	private LanguageService languageService;
	private WordIndexer wordIndexer;

	private static final Node GLOSSARY = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/gloss");
	private static Node wordURI = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/Word");
	private static Node wordRelation = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/word");
	private static Node lexicalForm = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/lexicalForm");
	private static Node partMeronymOf = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/partMeronymOf");
	private static Node partHolonymOf = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/partHolonymOf");
	private static Node partOfSpeech = Node.createURI("http://www.wordnet.dk/owl/instance/2009/03/schema/partOfSpeech");
	private static Node hyponymOf = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/hyponymOf");
	private static Node domain = Node.createURI("http://www.wordnet.dk/owl/instance/2009/03/schema/domain");
	private static Node nearSynonym = Node.createURI("http://www.wordnet.dk/owl/instance/2009/03/schema/nearSynonymOf");
	private static final Node containsWordSence = Node.createURI("http://www.w3.org/2006/03/wn/wn20/schema/containsWordSense");
	
	
	private static final Map<String,String> map = Maps.newHashMap();
	
	{
		map.put("http://www.w3.org/2006/03/wn/wn20/schema/NounWordSense", LexicalCategory.CODE_NOMEN);
		map.put("http://www.w3.org/2006/03/wn/wn20/schema/AdjectiveWordSense", LexicalCategory.CODE_ADJECTIVUM);
		map.put("http://www.w3.org/2006/03/wn/wn20/schema/AdjectiveSatelliteWordSense", LexicalCategory.CODE_ADJECTIVUM);
		map.put("http://www.w3.org/2006/03/wn/wn20/schema/VerbWordSense", LexicalCategory.CODE_VERBUM);
		map.put("http://www.w3.org/2006/03/wn/wn20/schema/AdverbWordSense", LexicalCategory.CODE_ADVERBIUM);
	}
	
	private enum Direction {in,out}

	// Settings...
	private boolean logToSystemOut = true;
	private boolean logModelWarnings = false;
	
	private boolean clearSynonyms = true;
	private boolean clearDisciplines = true;
	private boolean clearGeneralizations = true;
	private boolean createDisciplines = true;
	private boolean createPartOf = true;
	private boolean createGeneralizations = true;
	private boolean createSynonyms = true;
	private boolean updateProperties = true;
	
	private Set<String> consideredWords = Sets.newHashSet();
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
		Model model = loadModel();

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
		
		wordIndexer.setEnabled(false);
	}
	
	@Test
	public void testIt() throws Exception {
		
		
		int total = Lists.newArrayList(graph.find(null, RDF.type.asNode(), wordURI)).size();

		int start = 0;
		//start = (int) (((float)total)*.6f);
		//start = 0;
		//start = 9838;
		log.info("Total = "+total);
		log.info("Starting at "+start);
		
		//consideredWords.add("tidsmåler");
		//consideredWords.add("krat");
		
/*
		clearSynonyms = false;
		clearDisciplines = false;
		clearGeneralizations = false;
		createDisciplines = false;
		createPartOf = false;
		createGeneralizations = false;
		//createSynonyms = false;
		updateProperties = false;
*/		
		//createSynonyms = false;
		
		// Loop through all words
		ExtendedIterator<Triple> words = graph.find(null, RDF.type.asNode(), wordURI);
		{
			int num = 0;
			while (words.hasNext()) {
				num++;
				if (num < start) continue;

				Triple triple = (Triple) words.next();
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
					print(" - sense", getSimpleURI(sense));
					
					Node type = first(query.objectsFor(sense, RDF.type.asNode()));
					
					String label = getLabel(sense);
					
					
					Word localWord = findLocalWord(sense, label);
					
					// Lexical category...
					updateCategory(type, localWord);
					
					// Language...
					updateLanguage(danish, localWord);
					
					print(" - sense - label",label);
					print(" - sense - out", getRelations(sense, null));
					print(" - sense - in", getRelations(null, sense));
					
					ExtendedIterator<Node> synSets = query.subjectsFor(containsWordSence, sense);
					while (synSets.hasNext()) {
						Node synset = synSets.next();
						
						print(" - sense - synset", getSimpleURI(synset));
						print(" - sense - synset - out", getRelations(synset, null));
						print(" - sense - synset - in", getRelations(null, synset));
						
						if (updateProperties) {
							updateWordProperties(localWord, synset);
						}
						
						if (clearSynonyms) {
							removeExistingSynonyms(localWord);
						}
						
						if (clearDisciplines) {
							removeExistingDisciplines(localWord);							
						}
						if (clearGeneralizations) {
							removeExistingGeneralizations(localWord);
						}
						if (createDisciplines ) {
							ExtendedIterator<Node> domains = query.objectsFor(synset,domain);
							while (domains.hasNext()) {
								Node domain = domains.next();
								print(" - sense - synset - domain", getLabel(domain));
								ExtendedIterator<Node> wordSensesInDomain = query.objectsFor(domain,containsWordSence);
								while (wordSensesInDomain.hasNext()) {
									Node wordSenseInDomain = wordSensesInDomain.next();
									print(" - sense - synset - domain - sense", getLabel(wordSenseInDomain));
									createDiscipline(localWord, wordSenseInDomain);
								}
							}
						}
						if (createPartOf) {
							List<Node> partOfs = getRelatedSenses(synset, partMeronymOf, Direction.out);
							for (Node node : partOfs) {
								print(" - sense - synset - contains - sense", getLabel(node));
								createPartOf(localWord, node);
							}
							List<Node> antiPartOfs = getRelatedSenses(synset, partMeronymOf, Direction.in);
							for (Node node : antiPartOfs) {
								print(" - sense - synset - contains - sense", getLabel(node));
								createContains(localWord, node);
								
							}
							List<Node> holonyms = getRelatedSenses(synset, partHolonymOf, Direction.out);
							for (Node holonym : holonyms) {
								print(" - sense - synset - holonym - sense", getLabel(holonym));
								createContains(localWord, holonym);
							}
							List<Node> antiHolonyms = getRelatedSenses(synset, partHolonymOf, Direction.in);
							for (Node antiHolonym : antiHolonyms) {
								print(" - sense - synset - anti-holonym - sense", getLabel(antiHolonym));
								createPartOf(localWord, antiHolonym);
							}
						}
						
						if (createGeneralizations) {
						
							// Hyponym = Specialization / Subordinate

							List<Node> specializations = getRelatedSenses(synset, hyponymOf, Direction.in);
							for (Node specialization : specializations) {
								print(" - sense - synset - specialization - synset - sense", getLabel(specialization));
								createSpecialization(localWord, specialization);
							}
							
							// Anti-hyponym = Hypernym / Generalization / Superordinate

							List<Node> generalizations = getRelatedSenses(synset, hyponymOf, Direction.out);
							for (Node specialization : generalizations) {
								print(" - sense - synset - generalization - synset - sense", getLabel(specialization));
								createGeneralization(localWord, specialization);
							}
						}
						if (createSynonyms) {
							List<Node> synonyms = getRelatedSenses(synset, nearSynonym, Direction.in);
							for (Node synonym : synonyms) {

								print(" - sense - synset - synonym", getLabel(synonym));
								createSynonym(localWord, synonym, true);
							}
							List<Node> antiSynonyms = getRelatedSenses(synset, nearSynonym, Direction.out);
							for (Node synonym : antiSynonyms) {

								print(" - sense - synset - anti-synonym", getLabel(synonym));
								createSynonym(localWord, synonym, false);
							}
							
							// Create synonyms for the other words in the same synset
							ExtendedIterator<Node> wordsInSynset = query.objectsFor(synset, containsWordSence);
							while (wordsInSynset.hasNext()) {
								Node wordsenseOfSynset = wordsInSynset.next();
								if (wordsenseOfSynset.getURI().equals(sense.getURI())) {
									continue; // Skip existing
								}
								print(" - sense - synset - sense", getLabel(wordsenseOfSynset));
								
								createSynonym(localWord, wordsenseOfSynset, true);
								
							}
						}
						if (synSets.hasNext()) {
							localWord = findLocalWord(sense, label);
						}
					}
					//print(" - sense - in",Lists.newArrayList());
					modelService.commit();
					modelService.clearAndFlush();
				}
				print((Math.round((float) num)/((float) total)*100)+"%");
			}
		}

	}

	private List<Node> getRelatedSenses(Node synset, Node relation, Direction dir) {
		List<Node> found = Lists.newArrayList();
		{
			ExtendedIterator<Node> synsets = dir == Direction.in ? query.subjectsFor(relation,synset) : query.objectsFor(synset,relation);
			while (synsets.hasNext()) {
				Node relatedSynsets = synsets.next();
				ExtendedIterator<Node> wordSenses = query.objectsFor(relatedSynsets,containsWordSence);
				while (wordSenses.hasNext()) {
					found.add(wordSenses.next());
				}
			}
		}
		return found;
	}

	private void createSynonym(Word localWord, Node sense, boolean outgoing) throws ModelException {
		createRelation(localWord, sense, Relation.KIND_SEMANTICS_SYNONYMOUS, outgoing);
	}

	private void createDiscipline(Word localWord, Node sense) throws ModelException {
		createRelation(localWord, sense, Relation.KIND_SEMANTICS_DISCIPLINE, true);
	}

	private void createGeneralization(Word localWord, Node sense) throws ModelException {
		createRelation(localWord, sense, Relation.KIND_SEMANTICS_GENRALTIZATION, true);
	}

	private void createSpecialization(Word localWord, Node sense) throws ModelException {
		createRelation(localWord, sense, Relation.KIND_SEMANTICS_GENRALTIZATION, false);
	}

	private void createPartOf(Word localWord, Node sense) throws ModelException {
		createRelation(localWord, sense, Relation.KIND_SEMANTICS_CONTAINS, false);
	}

	private void createContains(Word localWord, Node sense) throws ModelException {
		createRelation(localWord, sense, Relation.KIND_SEMANTICS_CONTAINS, true);
	}

	private void createRelation(Word localWord, Node sense, String kind, boolean outgoing) throws ModelException {
		String label = getLabel(sense);
		if (Strings.isBlank(label)) {
			print("Will not create relation since the label is null : " + getSimpleURI(sense));
			return;
		}
		Word foundSynonym = findWord(label, sense.getURI());
		if (foundSynonym!=null) {
			List<Word> existingSynonyms;
			if (outgoing) {
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
			if (outgoing) {
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
		List<Relation> outgoingSynonyms = modelService.getRelationsFrom(localWord, Word.class, Relation.KIND_SEMANTICS_SYNONYMOUS);
		modelService.deleteRelations(outgoingSynonyms, adminUser);
		List<Relation> indcomingSynonyms = modelService.getRelationsTo(localWord, Word.class, Relation.KIND_SEMANTICS_SYNONYMOUS);
		modelService.deleteRelations(indcomingSynonyms, adminUser);
	}

	private void removeExistingGeneralizations(Word localWord) throws ModelException, SecurityException {
		List<Relation> from = modelService.getRelationsFrom(localWord, Word.class, Relation.KIND_SEMANTICS_GENRALTIZATION);
		modelService.deleteRelations(from, adminUser);
		List<Relation> to = modelService.getRelationsTo(localWord, Word.class, Relation.KIND_SEMANTICS_GENRALTIZATION);
		modelService.deleteRelations(to, adminUser);
	}

	private void removeExistingDisciplines(Word localWord) throws ModelException, SecurityException {
		{
			List<Relation> relations = modelService.getRelationsFrom(localWord, Word.class,Relation.KIND_SEMANTICS_DISCIPLINE);
			modelService.deleteRelations(relations, adminUser);
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
			if (example.toLowerCase().contains(localWord.getText().toLowerCase())) {
				localWord.addProperty(Property.KEY_SEMANTICS_EXAMPLE, example);
			}
		}
		modelService.updateItem(localWord, publicUser);
		modelService.commit();
	}

	private Word findLocalWord(Node sense, String label) throws ModelException {
		Word localWord = findWord(label, sense.getURI());
		if (localWord==null) {
			localWord = new Word();
			localWord.setText(label);
			localWord.addProperty(Property.KEY_DATA_SOURCE, sense.getURI());
			modelService.createItem(localWord, publicUser);
		} else {
			//print("found",localWord);
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
					modelService.createRelation(lexicalCategory, localWord, publicUser);
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
			modelService.createRelation(danish, localWord, publicUser);
			modelService.commit();
		} else if (logModelWarnings) {
			log.error("Language exists: "+language.getName());
		}
	}
	

	private Word findWord(String text, String sourceId) {
		List<Word> list = modelService.list(Query.after(Word.class).withField(Word.TEXT_FIELD, text).withCustomProperty(Property.KEY_DATA_SOURCE, sourceId));
		for (Word word : list) {
			if (word.getPropertyValues(Property.KEY_DATA_SOURCE).contains(sourceId)) {
				return word;
			}
		}
		return null;
	}

	private static void read(Model model, String fileName) throws FileNotFoundException, IOException {
		FileReader reader = new FileReader(new File(PATH,fileName));
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

	private static Model loadModel() throws FileNotFoundException, IOException {
		Model model = ModelFactory.createDefaultModel();
		read(model,"words.rdf");
		read(model,"wordsenses.rdf");
		read(model,"glossary.rdf");
		read(model,"part_of_speech.rdf");
		read(model,"synsets.rdf");
		read(model,"synset_attributes.rdf");
		read(model,"nearSynonymOf.rdf");
		read(model,"instanceOf.rdf");
		read(model,"instanceOf_taxonomic.rdf");
		read(model,"instanceOf.rdf");
		read(model,"instanceOf_taxonomic.rdf");
		read(model,"hyponymOf.rdf");
		read(model,"hypernymOf.rdf");

		read(model,"memberHolonymOf.rdf");
		read(model,"memberMeronymOf.rdf");
		read(model,"madeofHolonymOf.rdf");
		read(model,"madeofMeronymOf.rdf");
		read(model,"partHolonymOf.rdf");
		read(model,"partMeronymOf.rdf");
		
		read(model,"domain.rdf");
		return model;
	}

	
	@Autowired
	public void setLanguageService(LanguageService languageService) {
		this.languageService = languageService;
	}

	@Autowired
	public void setWordIndexer(WordIndexer wordIndexer) {
		this.wordIndexer = wordIndexer;
	}
	
	@Override
	public void setConfigurationService(ConfigurationService configurationService) {
		super.setConfigurationService(configurationService);
	}
}