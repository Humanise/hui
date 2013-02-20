package dk.in2isoft.onlineobjects.test.dangerous;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.modules.information.InformationService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestImportInformation extends AbstractSpringTestCase {
	
	private InformationService informationService;
	
	@Test
	public void run() throws ModelException {
		//informationService.clearUnvalidatedWords();
		informationService.importInformation("http://politiken.dk/rss/senestenyt.rss", null);
	}
	
	@Autowired
	public void setInformationService(InformationService informationService) {
		this.informationService = informationService;
	}

}