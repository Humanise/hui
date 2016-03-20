package dk.in2isoft.onlineobjects.apps.words.index;

import java.util.List;

import org.quartz.InterruptableJob;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.UnableToInterruptJobException;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.PropertyLimitation.Comparison;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.Results;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.index.WordIndexer;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspective;
import dk.in2isoft.onlineobjects.modules.language.WordListPerspectiveQuery;
import dk.in2isoft.onlineobjects.modules.scheduling.JobStatus;
import dk.in2isoft.onlineobjects.modules.scheduling.ServiceBackedJob;

public class WordIndexJob extends ServiceBackedJob implements InterruptableJob {
	
	private boolean interrupted;

	public void execute(JobExecutionContext context) throws JobExecutionException {
		newSchool(context);

	}

	private void newSchool(JobExecutionContext context) {
		JobStatus status = getStatus(context);
		WordIndexer wordIndexer = schedulingSupportFacade.getWordIndexer();
		ModelService modelService = schedulingSupportFacade.getModelService();

		try {
			status.log("Clearing index");
			wordIndexer.clear();
		} catch (EndUserException e) {
			status.error("Error while clearing index", e);
		}
		
		Query.after(Word.class).withCustomProperty("common.source", Comparison.LIKE, "http://www.wordnet.dk/%");
		
		WordListPerspectiveQuery query = new WordListPerspectiveQuery().orderByUpdated();
		int total = modelService.count(query);
		int pageSize = 500;
		int pages = (int) Math.ceil((double)total/(double)pageSize);

		try {
			for (int i = 0; i < pages; i++) {
				query.withPaging(i, pageSize);
				List<WordListPerspective> list = modelService.search(query).getList();
				wordIndexer.indexWordPerspectives(list);
				status.setProgress(i, pages);
				if (interrupted) {
					break;
				}
			}
		} catch (ModelException e) {
			status.error("Error while fetching words", e);
		}
	}

	private void oldSchool(JobExecutionContext context) {
		JobStatus status = getStatus(context);
		WordIndexer wordIndexer = schedulingSupportFacade.getWordIndexer();
		ModelService modelService = schedulingSupportFacade.getModelService();
		
		try {
			status.log("Clearing index");
			wordIndexer.clear();
		} catch (EndUserException e) {
			status.error("Error while clearing index", e);
		}
		Query<Word> query = Query.of(Word.class);
		Long count = modelService.count(query);
		status.log("Starting re-index of "+count+" words");
		int num = 0;
		int percent = -1;
		Results<Word> results = modelService.scroll(query);
		List<Word> batch = Lists.newArrayList();
		while (results.next()) {
			if (interrupted) {
				status.log("Interrupting indexing");
				break;
			}
			
			int newPercent = Math.round(((float)num)/(float)count*100);
			if (newPercent>percent) {
				percent = newPercent;
				status.setProgress(num, count.intValue());
			}
			Word word = results.get();
			batch.add(word);
			if (batch.size()>200) {
				wordIndexer.indexWords(batch);
				batch.clear();
				modelService.clearAndFlush();
			}
			num++;
		}
		results.close();
		status.log("Finished indexing words");
	}

	public void interrupt() throws UnableToInterruptJobException {
		interrupted = true;
	}

}
