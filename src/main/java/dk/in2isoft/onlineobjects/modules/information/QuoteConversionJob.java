package dk.in2isoft.onlineobjects.modules.information;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.Results;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.core.exceptions.SecurityException;
import dk.in2isoft.onlineobjects.model.HtmlPart;
import dk.in2isoft.onlineobjects.model.InternetAddress;
import dk.in2isoft.onlineobjects.model.Relation;
import dk.in2isoft.onlineobjects.model.Statement;
import dk.in2isoft.onlineobjects.model.User;
import dk.in2isoft.onlineobjects.modules.scheduling.JobStatus;
import dk.in2isoft.onlineobjects.modules.scheduling.ServiceBackedJob;

public class QuoteConversionJob extends ServiceBackedJob {

	public void execute(JobExecutionContext context) throws JobExecutionException {
		ModelService modelService = schedulingSupportFacade.getModelService();
		Query<HtmlPart> query = Query.after(HtmlPart.class);
		float total = modelService.count(query).floatValue();
		Results<HtmlPart> results = modelService.scroll(query);
		JobStatus status = getStatus(context);
		float num = 0;
		
		while (results.next()) {
			num++;
			status.setProgress(num/total);
			HtmlPart part = results.get();
			try {
				List<Relation> relations = modelService.getRelations(part);
				for (Relation relation : relations) {
					if (Relation.KIND_STRUCTURE_CONTAINS.equals(relation.getKind())) {
						if (relation.getFrom().getClass().equals(InternetAddress.class)) {
							User owner = modelService.getOwner(part);
							
							Statement statement = new Statement();
							statement.setText(part.getHtml());
							statement.setName(StringUtils.abbreviate(part.getHtml(), 50));
							modelService.createItem(statement, owner);
							modelService.createRelation(relation.getFrom(), statement, Relation.KIND_STRUCTURE_CONTAINS, owner);
							modelService.deleteEntity(part, owner);
							status.log("Converted: " + part.getHtml());
						}
					}
				}
			} catch (ModelException e) {
				status.error("Something heppened while converting quote", e);
			} catch (SecurityException e) {
				status.error("Unable to delete part: " + part.getHtml(), e);
			}
		}
		status.setProgress(1);
		modelService.commit();
	}

}
