package dk.in2isoft.onlineobjects.test.model;

import static org.junit.Assert.assertEquals;

import java.util.Date;
import java.util.List;

import org.junit.Test;

import dk.in2isoft.onlineobjects.core.Privileged;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.model.Word;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;


public class TestWord extends AbstractSpringTestCase {

	@Test
	public void testCreate() throws EndUserException {
		
		String text = new Date().toString();
		Privileged priviledged = getPublicUser();
		Word word = new Word();
		word.setText(text);
		assertEquals(text, word.getText());
		modelService.createItem(word, priviledged);
		{
			Query<Word> query = Query.of(Word.class).withField("text", text);
			List<Word> list = modelService.list(query);
			assertEquals(1, list.size());
			
			Word loaded = list.iterator().next();
			assertEquals(loaded.getText(), text);
		}
		
		modelService.deleteEntity(word, priviledged);
		modelService.commit();
	}
}
