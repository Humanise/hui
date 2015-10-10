package dk.in2isoft.onlineobjects.ui;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.Writer;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.yahoo.platform.yui.compressor.CssCompressor;

import dk.in2isoft.commons.http.HeaderUtil;
import dk.in2isoft.commons.lang.Files;
import dk.in2isoft.onlineobjects.services.ConfigurationService;

public class StylesheetWriter {

	private ConfigurationService configurationService;
	private PrintWriter writer;
	private String context;
	private Logger log = Logger.getLogger(StylesheetWriter.class);
	
	public StylesheetWriter(Request request, ConfigurationService configurationService) throws IOException {
		HttpServletResponse response = request.getResponse();
		response.setContentType("text/css");
		HeaderUtil.setOneMonthCache(response);
		this.context = request.getBaseContext();
		this.writer = response.getWriter();
		this.configurationService = configurationService;
	}

	private void write(Writer writer, String... path) throws IOException {
		File file = configurationService.getFile(path);
		if (!file.exists()) {
			log .error("The file does not exist: "+StringUtils.join(path,"/"));
			return;
		}
		String contents = Files.readString(file);
		if (ArrayUtils.contains(path, "apps")) {
			contents = StringUtils.replace(contents, "../", "style/");
		}
		if (ArrayUtils.contains(path, "core")) {
			contents = StringUtils.replace(contents, "../gfx/", "/core/gfx/");
			contents = StringUtils.replace(contents, "../fonts/", "/core/fonts/");
		}
		if (ArrayUtils.contains(path, "hui")) {
			contents = StringUtils.replace(contents, "../", context+"/hui/");
		}
		writer.write("\n\n/*** "+path[path.length-1]+" ***/\n\n");
		writer.write(contents);
	}

	public void write(Blend blend) throws IOException {
		List<String[]> paths = blend.getPaths();
		String hash = blend.getHash();
		write(paths, hash);
	}

	public void write(List<String[]> paths, String hash)
			throws IOException, FileNotFoundException {
		if (configurationService.isDevelopmentMode()) {
			for (String[] path : paths) {
				write(this.writer,path);
			}
		} else {
			String name = hash+"_"+configurationService.getDeploymentId()+".css";
			File file = new File(configurationService.getTempDir(),name);
			if (!file.exists()) {
				StringWriter writer = new StringWriter();
				for (String[] path : paths) {
					write(writer,path);
				}
				StringReader reader = new StringReader(writer.toString());
				FileWriter fileWriter = new FileWriter(file);
				CssCompressor compressor = new CssCompressor(reader);
				compressor.compress(fileWriter, -1);
				fileWriter.close();
			}
			FileReader fileReader = new FileReader(file); 
			IOUtils.copy(fileReader, this.writer);
			IOUtils.closeQuietly(fileReader);
		}
	}

}
