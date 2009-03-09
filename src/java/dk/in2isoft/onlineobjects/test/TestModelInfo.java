package dk.in2isoft.onlineobjects.test;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Collection;

import nu.xom.ParsingException;

import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.model.util.ModelClassInfo;
import dk.in2isoft.onlineobjects.publishing.Document;

public class TestModelInfo extends AbstractTestCase {

	private static Logger log = Logger.getLogger(TestModelInfo.class);
	
	public void testEntitySubclasses() throws ParsingException, IOException, URISyntaxException {
		Collection<ModelClassInfo> infos = Core.getInstance().getModel().getClassInfo();
		log.info(infos.size());
		Collection<ModelClassInfo> docs = Core.getInstance().getModel().getClassInfo(Document.class);
		log.info(docs.size());
		Collection<ModelClassInfo> objects = Core.getInstance().getModel().getClassInfo(Object.class);
		log.info(objects.size());
	}
}
