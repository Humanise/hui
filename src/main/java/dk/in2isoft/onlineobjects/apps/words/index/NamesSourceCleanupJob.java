package dk.in2isoft.onlineobjects.apps.words.index;

import java.util.List;

import org.quartz.InterruptableJob;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.UnableToInterruptJobException;

import com.google.common.collect.Lists;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.PropertyLimitation.Comparison;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.LexicalCategory;
import dk.in2isoft.onlineobjects.model.Property;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.WordService;
import dk.in2isoft.onlineobjects.modules.scheduling.JobStatus;
import dk.in2isoft.onlineobjects.modules.scheduling.ServiceBackedJob;
import dk.in2isoft.onlineobjects.services.LanguageService;
import dk.in2isoft.onlineobjects.services.SemanticService;

public class NamesSourceCleanupJob extends ServiceBackedJob implements InterruptableJob {
	
	private boolean interrupted;

	public void execute(JobExecutionContext context) throws JobExecutionException {
		JobStatus status = getStatus(context);
		ModelService modelService = schedulingSupportFacade.getModelService();
		WordService wordService = schedulingSupportFacade.getWordService();
		try {
		
			String src = "http://www.danskernesnavne.navneforskning.ku.dk/";
			Privileged admin = schedulingSupportFacade.getSecurityService().getAdminPrivileged();
			InternetAddress source = wordService.getSource(src , admin );
			
			LanguageService languageService = schedulingSupportFacade.getLanguageService();
			LexicalCategory first = languageService.getLexcialCategoryForCode(LexicalCategory.CODE_PROPRIUM_FIRST);
			LexicalCategory last = languageService.getLexcialCategoryForCode(LexicalCategory.CODE_PROPRIUM_LAST);
			List<? extends Entity> categories = Lists.newArrayList(first,last);
			//select word.id,relation.kind from word inner join property on property.entity_id=word.id and property.key='data.source' and property.value like 'http://www.wordnet.dk/%' left join relation on relation.super_entity_id=word.id and relation.kind='common.source' where relation.kind is null
			Query<Word> query = Query.after(Word.class).to(categories);
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
