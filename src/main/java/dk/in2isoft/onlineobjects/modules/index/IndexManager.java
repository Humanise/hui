package dk.in2isoft.onlineobjects.modules.index;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.commons.lang.time.StopWatch;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.analysis.util.CharArraySet;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field.Store;
import org.apache.lucene.document.StringField;
import org.apache.lucene.index.CorruptIndexException;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.IndexWriterConfig.OpenMode;
import org.apache.lucene.index.IndexableField;
import org.apache.lucene.index.MultiFields;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.Sort;
import org.apache.lucene.search.TermQuery;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.SimpleFSDirectory;
import org.apache.lucene.util.Bits;
import org.apache.lucene.util.Version;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.collect.LinkedListMultimap;
import com.google.common.collect.ListMultimap;
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
	private StandardAnalyzer analyzer;
	
	private static final Logger log = LoggerFactory.getLogger(IndexManager.class);
	
	public IndexManager() {
		analyzer = new StandardAnalyzer(Version.LUCENE_40, CharArraySet.EMPTY_SET);
	}
	
	public IndexManager(String directoryName) {
		this();
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
	
	private void ensureIndex() throws ExplodingClusterFuckException {
		Directory directory = getIndexFile();
		try {
			if (!DirectoryReader.indexExists(directory)) {
				openWriter().close();
			}		
		} catch (IOException e) {
			throw new ExplodingClusterFuckException("Unable to ensure index", e);
		}
	}
	
	private IndexReader openReader() throws ExplodingClusterFuckException {
		Directory directory = getIndexFile();
		try {
			ensureIndex();
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
		IndexWriterConfig iwc = new IndexWriterConfig(Version.LUCENE_40, analyzer);
		iwc.setWriteLockTimeout(1000*10);
		iwc.setOpenMode(OpenMode.CREATE_OR_APPEND);
		try {
			IndexWriter indexWriter = new IndexWriter(dir, iwc);
			return indexWriter;
		} catch (IOException e) {
			throw new ExplodingClusterFuckException("Unable to create index writer",e);
		}
	}
	
	public synchronized void update(Entity entity, Document document) throws EndUserException  {
		IndexWriter writer = null;
		try {
			writer = openWriter();
			populate(entity, document);
			writer.updateDocument(new Term("id",String.valueOf(entity.getId())),document,analyzer);
			writer.commit();
		} catch (IOException e) {
			throw new ExplodingClusterFuckException("Unable to update document: "+entity,e);
		} finally {
			closeWriter(writer);
		}
	}

	private void populate(Entity entity, Document document) {
		document.add(new StringField("id", String.valueOf(entity.getId()),Store.YES));
		document.add(new StringField("type", entity.getClass().getSimpleName().toLowerCase(),Store.YES));
	}
	
	public synchronized void update(Map<Entity ,Document> map) throws EndUserException  {
		IndexWriter writer = null;
		try {
			writer = openWriter();
			Set<Entry<Entity, Document>> entries = map.entrySet();
			for (Entry<Entity, Document> entry : entries) {
				Document document = entry.getValue();
				Entity entity = entry.getKey();
				populate(entity, document);
				writer.updateDocument(new Term("id",String.valueOf(entity.getId())),document);				
			}
			writer.commit();
		} catch (IOException e) {
			throw new ExplodingClusterFuckException("Unable to update documents",e);
		} finally {
			closeWriter(writer);
		}
	}

	public SearchResult<Document> getDocuments(int page, int size) throws ExplodingClusterFuckException {
		IndexReader reader = null;
		try {
			reader = openReader();

			List<Document> found = Lists.newArrayList();
			int start = page*size;
			int count = reader.numDocs();
			for (int i = start; i < count && i<start+size; i++) {
				Document document = reader.document(i);
				if (document!=null) {
					found.add(document);
				}
			}
			return new SearchResult<Document>(found, count);
		} catch (IOException e) {
			throw new ExplodingClusterFuckException(e);
		} finally {
			closeReader(reader);
		}
	}
	
	public Document getDocument(Entity entity) {
		TermQuery query = new TermQuery(new Term("id", String.valueOf(entity.getId())));
		try {
			SearchResult<IndexSearchResult> search = search(query, null, 0, 1);
			IndexSearchResult first = search.getFirst();
			if (first!=null) {
				return first.getDocument();				
			}
		} catch (ExplodingClusterFuckException e) {
			// TODO handle this
		}
		return null;
	}
	
	public List<Long> getIds(String text, int start, int size) throws ExplodingClusterFuckException {
		List<Long> ids = Lists.newArrayList();
		SearchResult<IndexSearchResult> searchResult = search(text, null, start, size);
		for (IndexSearchResult item : searchResult.getList()) {
			Document document = item.getDocument();
			IndexableField field = document.getField("id");
			ids.add(Long.parseLong(field.stringValue()));
		}
		return ids;
	}
	
	public List<Long> getIds(Query query, int start, int size) throws ExplodingClusterFuckException {
		List<Long> ids = Lists.newArrayList();
		SearchResult<IndexSearchResult> searchResult = search(query, null, start, size);
		for (IndexSearchResult item : searchResult.getList()) {
			Document document = item.getDocument();
			IndexableField field = document.getField("id");
			ids.add(Long.parseLong(field.stringValue()));
		}
		return ids;
	}
	
	public Query buildQuery(String text) {
		String field = "text";
		QueryParser parser = new QueryParser(Version.LUCENE_40, field , analyzer);
		parser.setAllowLeadingWildcard(true);
		try {
			return parser.parse(text);
		} catch (ParseException e) {
			
		}
		return null;
	}

	public SearchResult<IndexSearchResult> search(IndexSearchQuery query) throws ExplodingClusterFuckException {
		return search(query.getQuery(), query.getSort(), query.getPage(), query.getPageSize());
	}

	@Deprecated
	public SearchResult<IndexSearchResult> search(String text, Sort sort, int page, int size) throws ExplodingClusterFuckException {

		if (Strings.isBlank(text)) {
			return new SearchResult<IndexSearchResult>(new ArrayList<IndexSearchResult>(), 0);
		}
		String field = "text";
		QueryParser parser = new QueryParser(Version.LUCENE_40, field , analyzer);
		parser.setAllowLeadingWildcard(true);
		try {
			Query query = parser.parse(text);
			return search(query, sort, page, size);
		} catch (ParseException e) {
			List<IndexSearchResult> found = Lists.newArrayList();
			return new SearchResult<IndexSearchResult>(found, 0);
		}
	}
	
	public SearchResult<IndexSearchResult> search(Query query, Sort sort, int page, int size) throws ExplodingClusterFuckException {
		List<IndexSearchResult> found = Lists.newArrayList();
		int total = 0;
		IndexReader reader = null;
		try {
			reader = openReader();
			IndexSearcher searcher = new IndexSearcher(reader);
			int end = (page+1) * size;
			TopDocs topDocs = null;
			int n = 1000000;
			StopWatch watch = new StopWatch();
			watch.start();
			if (sort!=null) {
				topDocs = searcher.search(query, n, sort);
			} else {
				topDocs = searcher.search(query , n);
			}
			watch.stop();
			if (log.isTraceEnabled()) {
				log.trace("Search time: "+watch.getTime());
			}
			ScoreDoc[] scoreDocs = topDocs.scoreDocs;
			for (int i = page * size; i < Math.min(scoreDocs.length,end); i++) {
				Document document = reader.document(scoreDocs[i].doc);
				found.add(new IndexSearchResult(document, scoreDocs[i].score));
			}
			total = scoreDocs.length;
		} catch (Exception e) {
			throw new ExplodingClusterFuckException("Error while searching", e);
		} finally {
			closeReader(reader);
		}
		return new SearchResult<IndexSearchResult>(found, total);
	}
	
	public List<Long> getAllIds() throws ExplodingClusterFuckException {
		List<Long> ids = Lists.newArrayList();
		IndexReader reader = null;
		try {
			reader = openReader();
			Bits liveDocs = MultiFields.getLiveDocs(reader);
			for (int i=0; i<reader.maxDoc(); i++) {
			    if (liveDocs != null && !liveDocs.get(i))
			        continue;

			    Document document = reader.document(i);
				IndexableField field = document.getField("id");
				ids.add(Long.parseLong(field.stringValue()));
			}
		} catch (IOException e) {
			throw new ExplodingClusterFuckException("Error while reading from index",e);
		} finally {
			closeReader(reader);
		}
		return ids;
	}

	public ListMultimap<String, Long> getIdsByType() throws ExplodingClusterFuckException {
		ListMultimap<String, Long> ids = LinkedListMultimap.create();
		IndexReader reader = null;
		try {
			reader = openReader();
			Bits liveDocs = MultiFields.getLiveDocs(reader);
			for (int i=0; i<reader.maxDoc(); i++) {
			    if (liveDocs != null && !liveDocs.get(i))
			        continue;

			    Document document = reader.document(i);
				IndexableField field = document.getField("id");
				IndexableField typeField = document.getField("type");
				ids.put(typeField.stringValue(),Long.parseLong(field.stringValue()));
			}
		} catch (IOException e) {
			throw new ExplodingClusterFuckException("Error while reading from index",e);
		} finally {
			closeReader(reader);
		}
		return ids;
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
			writer.deleteDocuments(term);
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
	
	public void setDirectoryName(String directoryName) {
		this.directoryName = directoryName;
	}

}
