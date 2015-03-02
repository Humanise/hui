package dk.in2isoft.onlineobjects.test.compress;

import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.io.StringWriter;

import org.junit.Test;
import org.mozilla.javascript.ErrorReporter;
import org.springframework.beans.factory.annotation.Autowired;

import com.yahoo.platform.yui.compressor.CssCompressor;
import com.yahoo.platform.yui.compressor.JavaScriptCompressor;

import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.services.FileService;
import dk.in2isoft.onlineobjects.test.AbstractSpringTestCase;

public class TestCompression extends AbstractSpringTestCase {
	
	@Autowired
	private FileService fileService;

	@Test
	public void testCompressCSS() throws EndUserException, IOException {
		Reader reader = new FileReader(getTestFile("compress/style.css"));
		CssCompressor compressor = new CssCompressor(reader);
		StringWriter writer = new StringWriter();
		compressor.compress(writer, 1);
		reader.close();
		org.junit.Assert.assertEquals("body{background:red}", writer.toString());
	}

	@Test
	public void testCompressJS() throws EndUserException, IOException {
		Reader reader = new FileReader(getTestFile("compress/script.js"));
		ErrorReporter reporter = null;
		JavaScriptCompressor compressor = new JavaScriptCompressor(reader, reporter);
		StringWriter writer = new StringWriter();
		int linebreak = -1;
		boolean munge = true;
		boolean warn = false;
		boolean preserveAllSemiColons = false;
		boolean preserveStringLiterals = false;
		compressor.compress(writer, linebreak, munge, warn, preserveAllSemiColons, preserveStringLiterals);
		reader.close();
		org.junit.Assert.assertEquals("var i=0;function x(a){var b=0;return b*2};", writer.toString());
	}
}