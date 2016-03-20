package dk.in2isoft.onlineobjects.apps.words.index;

import java.util.List;

import org.quartz.InterruptableJob;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.UnableToInterruptJobException;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.PropertyLimitation.Comparison;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.WordService;
import dk.in2isoft.onlineobjects.modules.scheduling.JobStatus;
import dk.in2isoft.onlineobjects.modules.scheduling.ServiceBackedJob;

public class WordnetSourceCleanupJob extends ServiceBackedJob implements InterruptableJob {
	
	private boolean interrupted;

	public void execute(JobExecutionContext context) throws JobExecutionException {
		JobStatus status = getStatus(context);
		ModelService modelService = schedulingSupportFacade.getModelService();
		WordService wordService = schedulingSupportFacade.getWordService();
		try {
		
			String src = "http://wordnet.dk/";
			Privileged admin = schedulingSupportFacade.getSecurityService().getAdminPrivileged();
			InternetAddress source = wordService.getSource(src , admin );
			//select word.id,relation.kind from word inner join property on property.entity_id=word.id and property.key='data.source' and property.value like 'http://www.wordnet.dk/%' left join relation on relation.super_entity_id=word.id and relation.kind='common.source' where relation.kind is null
			Query<Word> query = Query.after(Word.class).withCustomProperty(Property.KEY_DATA_SOURCE, Comparison.LIKE, "http://www.wordnet.dk/%");
			int total = modelService.count(query).intValue();

			int pageSize = 500;
			int pages = (int) Math.ceil((double)total/(double)pageSize);

				for (int i = 0; i < pages; i++) {
					status.setProgress(i, pages);
					query.withPaging(i, pageSize);
					List<Word> list = modelService.search(query).getList();
					for (Word word : list) {
						if (interrupted) {
							modelService.commit();
							break;
						}
						wordService.updateSource(word, source, admin);
					}
					modelService.commit();
					if (interrupted) {
						break;
					}
				}
								
		} catch (EndUserException e) {
			status.error("Error while updating sources", e);
		}
	}

	public void interrupt() throws UnableToInterruptJobException {
		interrupted = true;
	}

}
