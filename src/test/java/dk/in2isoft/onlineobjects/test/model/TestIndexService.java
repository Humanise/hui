package dk.in2isoft.onlineobjects.test.model;

import static org.junit.Assert.assertEquals;

import java.util.List;

import org.apache.log4j.Logger;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.Field.Store;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.commons.parsing.HTMLDocument;
import dk.in2isoft.onlineobjects.apps.reader.index.ReaderQuery;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.modules.index.IndexManager;
import dk.in2isoft.onlineobjects.modules.index.IndexSearchQuery;
import dk.in2isoft.onlineobjects.modules.index.IndexSearchResult;
import dk.in2isoft.onlineobjects.modules.index.IndexService;
import dk.in2isoft.onlineobjects.modules.networking.HTMLService;
import dk.in2isoft.onlineobjects.services.ConfigurationService;
import dk.in2isoft.onlineobjects.services.FileService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestIndexService extends AbstractSpringTestCase {
	
	private static final Logger log = Logger.getLogger(TestIndexService.class);
	
	@Autowired
	private ConfigurationService configurationService;
	@Autowired
	private ModelService modelService;
	@Autowired
	private FileService fileService;
	@Autowired
	private IndexService indexService;
	@Autowired
	private HTMLService htmlService;
	
	//@Test
	public void testInternetAddress() throws EndUserException {
		IndexManager index = indexService.getIndex("testIndex");
		index.clear();
		assertEquals(0, index.getDocumentCount());
		Query<InternetAddress> query = Query.of(InternetAddress.class).withPaging(0, 20).orderByName();
		List<InternetAddress> list = modelService.list(query);
		for (InternetAddress address : list) {
			log.info(address.getAddress());
			Document doc = new Document();
			try {
				HTMLDocument html = htmlService.getDocumentSilently(address.getAddress());
				if (html!=null) {
					doc.add(new StringField("text", html.getText(), Field.Store.YES));
				}
			} catch (Exception e) {
				log.info(e.getMessage(), e);
			}
			index.update(address, doc);
		}
		assertEquals(list.size(), index.getDocumentCount());
	}
	
	
	@Test
	public void testSearch() throws EndUserException {
		IndexManager index = indexService.getIndex("testIndex");
		index.clear();
		assertEquals(0, index.getDocumentCount());
		{
			Document doc = new Document();
			doc.add(new TextField("text", "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Cras mattis consectetur purus sit amet fermentum. Donec sed odio dui. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Aenean lacinia bibendum nulla sed consectetur.", Store.NO));
			Entity entity = new Entity();
			entity.setId(1);
			index.update(entity, doc);
		}

		{
			Document doc = new Document();
			doc.add(new TextField("text", "the quick brown fox", Store.YES));
			Entity entity = new Entity();
			entity.setId(2);
			index.update(entity, doc);
		}
		assertEquals(2, index.getDocumentCount());
		
		IndexSearchQuery indexQuery = new IndexSearchQuery("a*");
		indexQuery.setPage(0);
		indexQuery.setPageSize(10);
		SearchResult<IndexSearchResult> found = index.search(indexQuery);
		assertEquals(1, found.getTotalCount());
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

	public void setHtmlService(HTMLService htmlService) {
		this.htmlService = htmlService;
	}
}