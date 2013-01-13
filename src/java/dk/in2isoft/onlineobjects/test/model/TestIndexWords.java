package dk.in2isoft.onlineobjects.test.model;

import static org.junit.Assert.assertEquals;

import org.apache.log4j.Logger;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.TextField;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.Results;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.index.IndexManager;
import dk.in2isoft.onlineobjects.modules.index.IndexService;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.FileService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations="classpath:applicationContext.xml")
public class TestIndexWords extends AbstractJUnit4SpringContextTests {
	
	private static final Logger log = Logger.getLogger(TestIndexWords.class);
	
	@Autowired
	private ConfigurationService configurationService;
	@Autowired
	private ModelService modelService;
	@Autowired
	private FileService fileService;
	@Autowired
	private IndexService indexService;
	
	@Test
	public void testUpdateWordsIndex() throws EndUserException {
		IndexManager index = indexService.getIndex(IndexService.WORDS_INDEX);
		index.clear();
		assertEquals(0, index.getDocumentCount());
		Query<Word> query = Query.of(Word.class);
		Long count = modelService.count(query);
		Results<Word> results = modelService.scroll(query);
		int num = 0;
		int percent = -1;
		while (results.next()) {
			Word word = results.get();
			Document doc = new Document();
			int newPercent = Math.round(((float)num)/(float)count*100);
			if (newPercent>percent) {
				percent = newPercent;
				log.info("running: "+percent+"%");
			}
			StringBuilder text = new StringBuilder();
			text.append(word.getText()).append(" ");
			String glossary = word.getPropertyValue(Property.KEY_SEMANTICS_GLOSSARY);
			if (glossary==null) {
				glossary="";
			}
			text.append(glossary);
			doc.add(new TextField("text", text.toString(), Field.Store.YES));
			doc.add(new TextField("word", word.getText(), Field.Store.YES));
			doc.add(new TextField("glossary", glossary, Field.Store.YES));
			index.update(word, doc);
			num++;
		}
		log.info("finished: "+percent+"%");
	}

	public void setFileService(FileService fileService) {
		this.fileService = fileService;
	}

	public FileService getFileService() {
		return fileService;
	}

	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}

	public ConfigurationService getConfigurationService() {
		return configurationService;
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}

	public ModelService getModelService() {
		return modelService;
	}

	public void setIndexService(IndexService indexService) {
		this.indexService = indexService;
	}

	public IndexService getIndexService() {
		return indexService;
	}
}