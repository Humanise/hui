package dk.in2isoft.onlineobjects.apps.words.index;

import java.util.List;

import org.hibernate.SQLQuery;
import org.quartz.InterruptableJob;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.UnableToInterruptJobException;

import dk.in2isoft.onlineobjects.core.CustomQuery;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.language.WordService;
import dk.in2isoft.onlineobjects.modules.scheduling.JobStatus;
import dk.in2isoft.onlineobjects.modules.scheduling.ServiceBackedJob;

public class NamesSourceCleanupJob extends ServiceBackedJob implements InterruptableJob {

	private boolean interrupted;

	public void execute(JobExecutionContext context) throws JobExecutionException {
		JobStatus status = getStatus(context);
		ModelService modelService = schedulingSupportFacade.getModelService();
		WordService wordService = schedulingSupportFacade.getWordService();
		try {

			String src = "http://www.danskernesnavne.navneforskning.ku.dk/";
			Privileged admin = schedulingSupportFacade.getSecurityService().getAdminPrivileged();
			InternetAddress source = wordService.getSource(src, admin);
			
			List<Long> ids = modelService.list(new Quer());
			{
				int total = ids.size();
				int pageSize = 500;
				int pages = (int) Math.ceil((double) total / (double) pageSize);

				for (int i = 0; i < pages; i++) {
					List<Long> subIds = ids.subList(i*pageSize, Math.min((i+1)*pageSize, total-1));
					Query<Word> query = Query.after(Word.class).withIds(subIds);
					List<Word> list = modelService.search(query).getList();
					for (Word word : list) {
						if (interrupted) {
							modelService.commit();
							break;
						}
						wordService.updateSource(word, source, admin);
					}
					modelService.commit();
					status.setProgress(i, pages);
					if (interrupted) {
						break;
					}
				}
			}

		} catch (EndUserException e) {
			status.error("Error while updating sources", e);
		}
	}

	public void interrupt() throws UnableToInterruptJobException {
		interrupted = true;
	}

	private class Quer implements CustomQuery<Long> {
		
		private String sql = " from word, relation, lexicalcategory where relation.sub_entity_id = word.id and relation.super_entity_id=lexicalcategory.id and lexicalcategory.code like 'proprium.personal%'";

		@Override
		public String getSQL() {
			return "select word.id" + sql;
		}

		@Override
		public String getCountSQL() {
			
			return "select count(word.id) as count" + sql;
		}

		@Override
		public Long convert(Object[] row) {
			
			return ((Number)row[0]).longValue();
		}

		@Override
		public void setParameters(SQLQuery sql) {
			
		}
		
	}
}
