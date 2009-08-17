package dk.in2isoft.onlineobjects.services;

import java.io.File;
import java.io.IOException;

import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.Field.Store;
import org.apache.lucene.index.CorruptIndexException;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.Term;
import org.apache.lucene.index.IndexWriter.MaxFieldLength;

import dk.in2isoft.onlineobjects.model.Entity;

public class IndexService {
	
	private ConfigurationService configurationService;
	private String directoryName = "index";

	private File getIndexFile() {
		return new File(configurationService.getStoragePath(),directoryName);
	}
	
	private IndexReader openReader() throws CorruptIndexException, IOException {
		return IndexReader.open(getIndexFile());
	}
	
	private void closeReader(IndexReader reader) throws IOException {
		if (reader!=null) {
			reader.close();
		}
	}
	
	public void update(Entity entity, Document document) throws IOException  {
		IndexWriter writer = null;
		try {
			writer = new IndexWriter(getIndexFile(), new StandardAnalyzer(),MaxFieldLength.LIMITED);
			document.add(new Field("id", String.valueOf(entity.getId()),Store.YES,Field.Index.ANALYZED_NO_NORMS));
			document.add(new Field("type", String.valueOf(entity.getType()),Store.YES,Field.Index.NO));
			writer.updateDocument(new Term("id",String.valueOf(entity.getId())),document);
		} finally {
			if (writer!=null) {
				writer.commit();
				writer.optimize();
				writer.close();
			}
		}
	}
	
	public void clear() throws IOException {
		ensureIndex();
		IndexReader reader = null;
		try {
			reader = openReader();
			int count = reader.numDocs();
			for (int i = 0; i < count; i++) {
				reader.deleteDocument(i);
			}
		} finally {
			closeReader(reader);
		}
	}
	
	public int getDocumentCount() throws IOException {
		ensureIndex();
		IndexReader reader = null;
		try {
			reader = openReader();
			return reader.numDocs();
		} finally {
			closeReader(reader);
		}
	}
	
	private void ensureIndex() throws IOException {

		IndexWriter writer = null;
		try {
			writer = new IndexWriter(getIndexFile(), new StandardAnalyzer(),MaxFieldLength.LIMITED);
		} finally {
			if (writer!=null) {
				writer.close();
			}
		}
		
	}
	
	public int delete(long id) throws IOException {
		ensureIndex();
		IndexReader reader = null;
		try {
			reader = openReader();
			Term term = new Term("id", String.valueOf(id));
			int count = reader.deleteDocuments(term);
			return count;
		} finally {
			closeReader(reader);
		}
	}
	
	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}

	public ConfigurationService getConfigurationService() {
		return configurationService;
	}

	public void setDirectoryName(String directoryName) {
		this.directoryName = directoryName;
	}

	public String getDirectoryName() {
		return directoryName;
	}

}
