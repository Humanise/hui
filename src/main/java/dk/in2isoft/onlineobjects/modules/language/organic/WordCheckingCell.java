package dk.in2isoft.onlineobjects.modules.language.organic;

import dk.in2isoft.onlineobjects.core.ItemQuery;
import dk.in2isoft.onlineobjects.core.ModelService;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.modules.organic.Cell;

public class WordCheckingCell extends Cell {
	
	private String checkedScent = "word.checked";
	
	private ModelService modelService;

	@Override
	public void beat() {
		ItemQuery<Word> query = Query.after(Word.class).withCustomProperty("scent", checkedScent).withPaging(0, 10);
		modelService.search(query);
	}

	public void setModelService(ModelService modelService) {
		this.modelService = modelService;
	}
}
