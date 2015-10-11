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
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import dk.in2isoft.commons.http.HeaderUtil;
import dk.in2isoft.commons.lang.Files;
import dk.in2isoft.onlineobjects.services.ConfigurationService;

public class ScriptWriter {

	private static final Logger log = Logger.getLogger(ScriptWriter.class);

	private ConfigurationService configurationService;
	private PrintWriter writer;

	public ScriptWriter(Request request, ConfigurationService configurationService) throws IOException {
		HttpServletResponse response = request.getResponse();
		response.setContentType("text/javascript");
		HeaderUtil.setOneMonthCache(response);
		this.writer = response.getWriter();
		this.configurationService = configurationService;
	}

	private void write(Writer writer, String... path) throws IOException {
		File file = configurationService.getFile(path);
		if (!file.exists()) {
			log.error("The file does not exist: " + StringUtils.join(path, "/"));
		} else {
			String contents = Files.readString(file);
			writer.write("\n\n/*** " + path[path.length - 1] + " ***/\n\n");
			writer.write(contents);
		}
	}

	public void write(Blend blend) throws IOException {
		List<String[]> paths = blend.getPaths();
		String hash = blend.getHash();
		write(paths, hash);
	}

	public void write(List<String[]> paths, String hash) throws IOException, FileNotFoundException {
		if (!configurationService.isOptimizeResources() || configurationService.isDevelopmentMode()) {
			for (String[] path : paths) {
				write(this.writer, path);
			}
		} else {
			String name = hash + "_" + configurationService.getDeploymentId() + ".js";
			File file = new File(configurationService.getTempDir(), name);
			if (!file.exists() || configurationService.isDevelopmentMode()) {
				StringWriter writer = new StringWriter();
				for (String[] path : paths) {
					write(writer, path);
				}
				String script = writer.toString();
				compress(file, script);
			}
			if (file.exists()) {
				FileReader fileReader = new FileReader(file);
				IOUtils.copy(fileReader, this.writer);
				IOUtils.closeQuietly(fileReader);
			}
		}
	}

	private void compress(File file, String script) throws IOException {
		StringReader reader = new StringReader(script);
		FileWriter fileWriter = new FileWriter(file);
		try {
			new ScriptCompressor().compress(reader, fileWriter);
		} catch (Exception e) {
			this.writer.print(script);
			log.error(e.getMessage(), e);
			IOUtils.closeQuietly(fileWriter);
			if (file.exists()) {
				file.delete();
			}
		} finally {
			IOUtils.closeQuietly(fileWriter);
		}
	}
}
