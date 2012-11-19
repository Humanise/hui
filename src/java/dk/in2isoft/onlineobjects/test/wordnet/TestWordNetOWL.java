package dk.in2isoft.onlineobjects.test.wordnet;

import java.io.File;
import java.util.Iterator;
import java.util.Set;

import org.apache.commons.lang.time.StopWatch;
import org.apache.log4j.Logger;
import org.joda.time.Duration;
import org.junit.Test;
import org.semanticweb.owlapi.apibinding.OWLManager;
import org.semanticweb.owlapi.model.IRI;
import org.semanticweb.owlapi.model.OWLAnnotation;
import org.semanticweb.owlapi.model.OWLAxiom;
import org.semanticweb.owlapi.model.OWLClass;
import org.semanticweb.owlapi.model.OWLDataProperty;
import org.semanticweb.owlapi.model.OWLNamedIndividual;
import org.semanticweb.owlapi.model.OWLOntology;
import org.semanticweb.owlapi.model.OWLOntologyManager;
import org.semanticweb.owlapi.reasoner.Node;
import org.semanticweb.owlapi.reasoner.NodeSet;
import org.semanticweb.owlapi.reasoner.OWLReasoner;
import org.semanticweb.owlapi.reasoner.OWLReasonerFactory;
import org.semanticweb.owlapi.reasoner.structural.StructuralReasonerFactory;

import uk.ac.manchester.cs.owl.owlapi.OWLAnnotationPropertyImpl;
import uk.ac.manchester.cs.owl.owlapi.OWLClassImpl;
import dk.in2isoft.onlineobjects.test.AbstractTestCase;

public class TestWordNetOWL extends AbstractTestCase {

	private static final Logger log = Logger.getLogger(TestWordNetOWL.class);
	
	private void printClass(OWLClass clazz, OWLReasoner reasoner,String prefix) {
		print("Class",prefix+clazz+ " ("+reasoner.getInstances(clazz, true).getNodes().size()+")");
		Set<OWLClass> flattened = reasoner.getSubClasses(clazz, true).getFlattened();
		for (OWLClass sub : flattened) {
			if (reasoner.isSatisfiable(sub)) {
				printClass(sub, reasoner, prefix+" - ");
			}
		}
	}

	@Test
	public void testIt() throws Exception {
		StopWatch watch = new StopWatch();
		watch.start();
		log.info("Starting: "+new Duration(watch.getTime()));
		OWLOntologyManager manager = OWLManager.createOWLOntologyManager();
		IRI documentIRI = IRI.create(new File("/Users/jbm/Development/Workspace/onlineobjects/testdata/DanNet-2.1_owl/DanNet_full.owl"));
		OWLOntology ontology = manager.loadOntologyFromOntologyDocument(documentIRI);
		log.info("Imported: "+new Duration(watch.getTime()));
		/*
		manager.addOntologyStorer(new OWLTutorialSyntaxOntologyStorer());
		// Save using a different format
		manager.saveOntology(ontology, new OWLTutorialSyntaxOntologyFormat(),
		  new SystemOutDocumentTarget());
		
		if (true) return;*/
		
		OWLReasonerFactory reasonerFactory = new StructuralReasonerFactory();
		OWLReasoner reasoner = reasonerFactory.createReasoner(ontology);
		
		Set<OWLClass> classesInSignature = ontology.getClassesInSignature();
		Set<OWLNamedIndividual> individualsInSignature = ontology.getIndividualsInSignature();

		OWLClass clazz = manager.getOWLDataFactory().getOWLThing();
		printClass(clazz, reasoner, "");
		
		print("Axium count",ontology.getAxiomCount());
		print("Individuals count",individualsInSignature.size());
		print("Classes in signature",classesInSignature);
		for (OWLClass cls : classesInSignature) {
			print("Class",cls);
			print(" - axioms",ontology.getAxioms(cls).size());
			int count = reasoner.getInstances(cls, true).getNodes().size();
			print(" - instances",count);
			
		}

		Set<OWLAxiom> axioms = ontology.getAxioms();
		
		OWLClass nounClass = new OWLClassImpl(IRI.create("http://www.w3.org/2006/03/wn/wn20/schema/NounSynset"));
		Iterator<Node<OWLNamedIndividual>> nouns = reasoner.getInstances(nounClass, true).iterator();
		int i = 0;
		while (nouns.hasNext() && i<10) {
			Node<OWLNamedIndividual> node =  nouns.next();
			print("Noun",node.getRepresentativeElement());
			OWLNamedIndividual individual = node.getRepresentativeElement();
			print("- annotations",individual.getAnnotations(ontology));
			print("- classes in signature",individual.getClassesInSignature());
			print("- types",reasoner.getTypes(individual, false));
			print("- getDifferentIndividuals",reasoner.getDifferentIndividuals(individual));
			i++;
		}
		
		//if (true) return;
		
		{
			int num = 0;
			for (OWLNamedIndividual namedIndividual : individualsInSignature) {
				Set<OWLAnnotation> lexicalForms = namedIndividual.getAnnotations(ontology,new OWLAnnotationPropertyImpl(IRI.create("http://www.w3.org/2006/03/wn/wn20/schema/lexicalForm")));
				//if (lexicalForms.isEmpty()) continue;
				//print(" - entityType",namedIndividual.getEntityType());
				print("namedIndividual",namedIndividual);
				for (OWLAnnotation lex : lexicalForms) {
					print(" - lexicalForm",lex.getValue());					
				}
				Set<OWLAnnotation> parts = namedIndividual.getAnnotations(ontology,new OWLAnnotationPropertyImpl(IRI.create("http://www.wordnet.dk/owl/instance/2009/03/schema/partOfSpeech")));
				for (OWLAnnotation owlAnnotation : parts) {
					print(" - partOfSpeech",owlAnnotation.getValue());										
				}
				//print(" - annotation",namedIndividual.getAnnotations(ontology));
				//print(" - objectPropertyValues",namedIndividual.getObjectPropertyValues(ontology));
				//print(" - referencingAxioms",ontology.getReferencingAxioms(namedIndividual));
				print(" - axioms",ontology.getAxioms(namedIndividual));
				print(" - referencing axioms",ontology.getReferencingAxioms(namedIndividual));
				print(" - same individuals",reasoner.getSameIndividuals(namedIndividual));
				print(" - individuals in signature",namedIndividual.getIndividualsInSignature());
				print(" - class assertions",ontology.getClassAssertionAxioms(namedIndividual));
				NodeSet<OWLNamedIndividual> differentIndividuals = reasoner.getDifferentIndividuals(namedIndividual);
				print(" - differentIndividuals",differentIndividuals.getFlattened());
				print(" - getDataPropertiesInSignature",namedIndividual.getDataPropertiesInSignature());
				print(" - dataPropertyValues",namedIndividual.getDataPropertyValues(ontology));
				print(" - objectPropertyValues",namedIndividual.getObjectPropertyValues(ontology));
				num++;
				if (num>10) break;				
			}
		}
		//if (true) return;
		{
			int num = 0;
			for (OWLAxiom axiom : axioms) {
				print("axiom",axiom);
				print("- type",axiom.getAxiomType());
				num++;
				if (num>10) break;
			}
		}
		{
			int num = 0;
			Set<OWLDataProperty> dataPropertiesInSignature = ontology.getDataPropertiesInSignature();
			for (OWLDataProperty axiom : dataPropertiesInSignature) {
				print("dataProperty",axiom);
				print("- annotations",axiom.getAnnotations(ontology));
				num++;
				if (num>10) break;
			}
		}
		
	}

	protected void print(String string, Object object) {
		System.out.println(string+": "+object);
	}

}