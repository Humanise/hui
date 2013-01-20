package dk.in2isoft.onlineobjects.test.model;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.modules.index.IndexService;
import dk.in2isoft.onlineobjects.modules.index.WordIndexer;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.FileService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations="classpath:applicationContext.xml")
public class TestIndexWords extends AbstractJUnit4SpringContextTests {
	
	//private static final Logger log = Logger.getLogger(TestIndexWords.class);
	
	@Autowired
	private ConfigurationService configurationService;
	@Autowired
	private ModelService modelService;
	@Autowired
	private FileService fileService;
	@Autowired
	private IndexService indexService;
	@Autowired
	WordIndexer wordIndexer;
	
	@Test
	public void testUpdateWordsIndex() throws EndUserException {
		wordIndexer.rebuild();
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
	
	public void setWordIndexer(WordIndexer wordIndexer) {
		this.wordIndexer = wordIndexer;
	}
}