package dk.in2isoft.onlineobjects.modules.index;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field.Store;
import org.apache.lucene.document.LongField;
import org.apache.lucene.document.StringField;
import org.apache.lucene.index.CorruptIndexException;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.IndexWriterConfig.OpenMode;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.SimpleFSDirectory;
import org.apache.lucene.util.Version;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.lang.Strings;
import dk.in2isoft.onlineobjects.core.SearchResult;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.ExplodingClusterFuckException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.services.ConfigurationService;

public class IndexManager {

	private ConfigurationService configurationService;
	private String directoryName = "index";
	
	public IndexManager(String directoryName) {
		this.directoryName = directoryName;
	}

	private Directory getIndexFile() throws ExplodingClusterFuckException {
		File dir = new File(configurationService.getIndexDir(),directoryName);
		try {
			return new SimpleFSDirectory(dir);
		} catch (IOException e) {
			throw new ExplodingClusterFuckException("Unable to read index");
		}
	}
	
	private IndexReader openReader() throws ExplodingClusterFuckException {
		try {
			openWriter().close();
			Directory directory = getIndexFile();
			return DirectoryReader.open(directory);
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
	
	private IndexWriter openWriter() throws ExplodingClusterFuckException {
		Directory dir = getIndexFile();
		Analyzer analyzer = new StandardAnalyzer(Version.LUCENE_40);
		IndexWriterConfig iwc = new IndexWriterConfig(Version.LUCENE_40, analyzer);
		iwc.setOpenMode(OpenMode.CREATE_OR_APPEND);
		try {
			IndexWriter indexWriter = new IndexWriter(dir, iwc);
			return indexWriter;
		} catch (IOException e) {
			throw new ExplodingClusterFuckException("Unable to create index writer",e);
		}
	}
	
	public void update(Entity entity, Document document) throws EndUserException  {
		IndexWriter writer = null;
		try {
			writer = openWriter();
			document.add(new LongField("id", entity.getId(),Store.YES));
			document.add(new StringField("type", String.valueOf(entity.getType()),Store.YES));
			writer.updateDocument(new Term("id",String.valueOf(entity.getId())),document);
			writer.commit();
		} catch (IOException e) {
			throw new ExplodingClusterFuckException("Unable to update document: "+entity,e);
		} finally {
			closeWriter(writer);
		}
	}
	
	public List<Document> getDocuments() throws ExplodingClusterFuckException {
		List<Document> found = Lists.newArrayList();
		IndexReader reader = null;
		try {
			reader = openReader();
			
			int count = reader.numDocs();
			for (int i = 0; i < count; i++) {
				Document document = reader.document(i);
				if (document!=null) {
					found.add(document);
				}
			}
		} catch (IOException e) {
			
		} finally {
			closeReader(reader);
		}
		return found;
	}
	
	public SearchResult<IndexSearchResult> search(String text, int start, int size) throws ExplodingClusterFuckException {
		List<IndexSearchResult> found = Lists.newArrayList();
		int total = 0;
		if (Strings.isBlank(text)) {
			return new SearchResult<IndexSearchResult>(new ArrayList<IndexSearchResult>(), 0);
		}
		IndexReader reader = null;
		try {
			reader = openReader();
			IndexSearcher searcher = new IndexSearcher(reader );
			String field = "text";
			QueryParser parser = new QueryParser(Version.LUCENE_40, field , new StandardAnalyzer(Version.LUCENE_40));
			Query query = parser.parse(text);
			int end = (start+1)*size;
			TopDocs topDocs = searcher.search(query , 100000);
			ScoreDoc[] scoreDocs = topDocs.scoreDocs;
			for (int i = start*size; i < Math.min(scoreDocs.length,end); i++) {
				Document document = reader.document(scoreDocs[i].doc);
				found.add(new IndexSearchResult(document, scoreDocs[i].score));
			}
			total = scoreDocs.length;
		} catch (ParseException e) {
			// Ignore just return empty
		} catch (Exception e) {
			throw new ExplodingClusterFuckException("Error while searching", e);
		} finally {
			closeReader(reader);
		}
		return new SearchResult<IndexSearchResult>(found, total);
	}
	
	public void clear() throws EndUserException {
		IndexWriter writer = null;
		try {
			writer = openWriter();
			writer.deleteAll();
			writer.commit();
		} catch (IOException e) {
			throw new ExplodingClusterFuckException("Unable to clear index",e);
		} finally {
			closeWriter(writer);
		}
	}
	
	public int getDocumentCount() throws EndUserException {
		IndexReader reader = null;
		try {
			reader = openReader();
			return reader.numDocs();
		} finally {
			closeReader(reader);
		}
	}
	
	public void delete(long id) throws EndUserException {
		IndexWriter writer = null;
		try {
			writer = openWriter();
			Term term = new Term("id", String.valueOf(id));
			openWriter().deleteDocuments(term);
		} catch (IOException e) {
			throw new EndUserException(e);
		} finally {
			closeWriter(writer);
		}
	}
	
	private void closeWriter(IndexWriter writer) {
		if (writer!=null) {
			try {
				writer.commit();
				writer.close();
			} catch (IOException e) {
				
			}
		}
	}

	public void setConfigurationService(ConfigurationService configurationService) {
		this.configurationService = configurationService;
	}

	public String getDirectoryName() {
		return directoryName;
	}

}
