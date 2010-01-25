package dk.in2isoft.onlineobjects.test.model;

import java.io.IOException;
import java.util.List;

import static junit.framework.Assert.*;

import org.apache.log4j.Logger;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.onlineobjects.core.ModelException;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.FileService;
import dk.in2isoft.onlineobjects.services.IndexService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations="classpath:applicationContext.xml")
public class TestIndexService extends AbstractJUnit4SpringContextTests {
	
	private static final Logger log = Logger.getLogger(TestIndexService.class);
	
	@Autowired
	private ConfigurationService configurationService;
	@Autowired
	private ModelService modelService;
	@Autowired
	private FileService fileService;
	@Autowired
	private IndexService indexService;
	
	@Test
	public void testInternetAddress() throws IOException, ModelException {
		indexService.setDirectoryName("testIndex");
		indexService.clear();
		assertEquals(0, indexService.getDocumentCount());
		Query<InternetAddress> query = Query.of(InternetAddress.class).withPaging(0, 20).orderByName();
		List<InternetAddress> list = modelService.list(query);
		for (InternetAddress address : list) {
			log.info(address.getAddress());
			Document doc = new Document();
			try {
				HTMLDocument html = new HTMLDocument(address.getAddress());
				doc.add(new Field("text", html.getText(), Field.Store.YES, Field.Index.ANALYZED));
			} catch (Exception e) {
				log.info(e.getMessage(), e);
			}
			indexService.update(address, doc);
		}
		assertEquals(list.size(), indexService.getDocumentCount());
	}
	
	@Test
	public void testSearch() throws IOException, ModelException {
		indexService.setDirectoryName("testIndex");
		indexService.clear();
		assertEquals(0, indexService.getDocumentCount());
		
		
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