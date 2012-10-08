package dk.in2isoft.onlineobjects.modules.index;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.Field.Store;
import org.apache.lucene.index.CorruptIndexException;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.StaleReaderException;
import org.apache.lucene.index.Term;
import org.apache.lucene.index.IndexWriter.MaxFieldLength;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.LockObtainFailedException;
import org.apache.lucene.store.SimpleFSDirectory;
import org.apache.lucene.util.Version;

import dk.in2isoft.onlineobjects.core.EndUserException;
import dk.in2isoft.onlineobjects.core.ExplodingClusterFuckException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.services.ConfigurationService;

public class IndexManager {

	private ConfigurationService configurationService;
	private String directoryName = "index";
	
	public IndexManager(String directoryName) {
		this.directoryName = directoryName;
	}

	private Directory getIndexFile() throws ExplodingClusterFuckException {
		File dir = new File(configurationService.getStoragePath(),directoryName);
		try {
			return new SimpleFSDirectory(dir);
		} catch (IOException e) {
			throw new ExplodingClusterFuckException("Unable to read index");
		}
	}
	
	private IndexReader openReader() throws ExplodingClusterFuckException {
		try {
			return IndexReader.open(getIndexFile(),false);
		} catch (CorruptIndexException e) {
			throw new ExplodingClusterFuckException(e);
		} catch (IOException e) {
			throw new ExplodingClusterFuckException(e);
		}
	}
	
	private void closeReader(IndexReader reader) {
		if (reader!=null) {
			try {
				reader.close();
			} catch (IOException e) {
			}
		}
	}
	
	public void update(Entity entity, Document document) throws EndUserException  {
		IndexWriter writer = null;
		try {
			writer = new IndexWriter(getIndexFile(), new StandardAnalyzer(),MaxFieldLength.LIMITED);
			document.add(new Field("id", String.valueOf(entity.getId()),Store.YES,Field.Index.ANALYZED_NO_NORMS));
			document.add(new Field("type", String.valueOf(entity.getType()),Store.YES,Field.Index.NO));
			writer.updateDocument(new Term("id",String.valueOf(entity.getId())),document);
		} catch (IOException e) {
			
		} finally {
			if (writer!=null) {
				try {
					writer.commit();
					writer.optimize();
					writer.close();
				} catch (CorruptIndexException e) {
					throw new ExplodingClusterFuckException(e);
				} catch (IOException e) {
					throw new ExplodingClusterFuckException(e);
				}
			}
		}
	}
	
	public List<Object> search() {
		return null;
	}
	
	public void clear() throws EndUserException {
		ensureIndex();
		IndexReader reader = null;
		try {
			reader = openReader();
			int count = reader.numDocs();
			for (int i = 0; i < count; i++) {
				try {
					reader.deleteDocument(i);
				} catch (StaleReaderException e) {
					
				} catch (CorruptIndexException e) {
					
				} catch (LockObtainFailedException e) {
					
				} catch (IOException e) {
					
				}
			}
		} finally {
			closeReader(reader);
		}
	}
	
	public int getDocumentCount() throws EndUserException {
		ensureIndex();
		IndexReader reader = null;
		try {
			reader = openReader();
			return reader.numDocs();
		} finally {
			closeReader(reader);
		}
	}
	
	private void ensureIndex() throws EndUserException {
		IndexWriter writer = null;
		try {
			writer = new IndexWriter(getIndexFile(), new StandardAnalyzer(),MaxFieldLength.LIMITED);
		} catch (IOException e) {
			throw new EndUserException(e);
		} finally {
			if (writer!=null) {
				try {
					writer.close();
				} catch (CorruptIndexException e) {
					throw new EndUserException(e);
				} catch (IOException e) {
					throw new EndUserException(e);
				}
			}
		}
		
	}
	
	public int delete(long id) throws EndUserException {
		ensureIndex();
		IndexReader reader = null;
		try {
			reader = openReader();
			Term term = new Term("id", String.valueOf(id));
			int count = reader.deleteDocuments(term);
			return count;
		} catch (IOException e) {
			throw new EndUserException(e);
		} finally {
			closeReader(reader);
		}
	}
	
	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}

	public String getDirectoryName() {
		return directoryName;
	}

}
