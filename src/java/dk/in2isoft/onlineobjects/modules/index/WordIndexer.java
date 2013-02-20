package dk.in2isoft.onlineobjects.modules.index;

import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.apache.lucene.document.Document;

import com.google.common.collect.Maps;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.events.ModelEventListener;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.Word;

public class WordIndexer implements ModelEventListener {
		
	private WordIndexDocumentBuilder documentBuilder;
	
	private ModelService modelService;
	
	private IndexManager indexManager;
	
	private static final Logger log = Logger.getLogger(WordIndexer.class);

	public void clear() throws EndUserException {
		indexManager.clear();
	}
	
	public void entityWasCreated(Entity entity) {
		if (entity instanceof Word) {
			indexWord((Word) entity);
		}
	}
	
	public void indexWord(Word word) {
		try {
			Document document = documentBuilder.build(word);
			log.debug("Re-indexing : "+word);
			indexManager.update(word, document);
		} catch (EndUserException e) {
			log.error("Unable to reindex: "+word, e);
		}
	}

	public void indexWords(List<Word> words) {
		try {
			Map<Entity,Document> map = Maps.newHashMap();
			for (Word word : words) {
				Document document = documentBuilder.build(word);
				log.debug("Re-indexing : "+word);
				map.put(word, document);
			}
			indexManager.update(map);
		} catch (EndUserException e) {
			log.error("Unable to reindex", e);
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
