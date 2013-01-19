package dk.in2isoft.onlineobjects.modules.index;

import org.apache.log4j.Logger;
import org.apache.lucene.document.Document;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.Results;
import dk.in2isoft.onlineobjects.core.events.ModelEventListener;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.Word;

public class WordIndexer implements ModelEventListener, Indexer {
		
	private WordIndexDocumentBuilder documentBuilder;
	
	private ModelService modelService;
	
	private IndexManager indexManager;
	
	private static final Logger log = Logger.getLogger(WordIndexer.class);

	public void rebuild() {
		try {
			indexManager.clear();
		} catch (EndUserException e) {
			log.error("Exception while clearing index, continuing...",e);
		}
		Query<Word> query = Query.of(Word.class);
		Long count = modelService.count(query);
		int num = 0;
		int percent = -1;
		Results<Word> results = modelService.scroll(query);
		while (results.next()) {
			int newPercent = Math.round(((float)num)/(float)count*100);
			if (newPercent>percent) {
				percent = newPercent;
				log.info("indexing words: "+percent+"%");
			}
			Word word = results.get();
			indexWord(word);
		}
		results.close();
		log.info("Finished indexing words");
	}
	
	public void entityWasCreated(Entity entity) {
		if (entity instanceof Word) {
			indexWord((Word) entity);
		}
	}
	
	private void indexWord(Word word) {
		Document document = documentBuilder.build(word);
		try {
			log.info("Re-indexing : "+word);
			indexManager.update(word, document);
		} catch (EndUserException e) {
			log.error("Unable to reindex: "+word, e);
		}
	}

	public void entityWasUpdated(Entity entity) {
		if (entity instanceof Word) {
			indexWord((Word) entity);
		}		
	}

	public void entityWasDeleted(Entity entity) {
		if (entity instanceof Word) {
			try {
				indexManager.delete(entity.getId());
			} catch (EndUserException e) {
				log.error("Unable to remove: "+entity, e);
			}
		}
	}

	public void relationWasCreated(Relation relation) {
		if (relation.getSuperEntity() instanceof Word) {
			indexWord((Word) relation.getSuperEntity());
		}
		if (relation.getSubEntity() instanceof Word) {
			indexWord((Word) relation.getSubEntity());
		}
	}

	public void relationWasUpdated(Relation relation) {
		if (relation.getSuperEntity() instanceof Word) {
			indexWord((Word) relation.getSuperEntity());
		}
		if (relation.getSubEntity() instanceof Word) {
			indexWord((Word) relation.getSubEntity());
		}
	}

	public void relationWasDeleted(Relation relation) {
		if (relation.getSuperEntity() instanceof Word) {
			indexWord((Word) relation.getSuperEntity());
		}
		if (relation.getSubEntity() instanceof Word) {
			indexWord((Word) relation.getSubEntity());
		}
	}

	// Wiring...
	
	public void setIndexManager(IndexManager indexManager) {
		this.indexManager = indexManager;
	}
	
	public void setDocumentBuilder(WordIndexDocumentBuilder documentBuilder) {
		this.documentBuilder = documentBuilder;
	}
	
	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
}
