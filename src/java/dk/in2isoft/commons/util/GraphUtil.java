package dk.in2isoft.commons.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;

import com.google.common.collect.ImmutableList;

import dk.in2isoft.onlineobjects.core.ConfigurationException;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;

public class GraphUtil extends AbstractCommandLineInterfaceUtil {

	private static Logger log = Logger.getLogger(GraphUtil.class);
	private static final ImmutableList<String> formats = ImmutableList.of("png","jpg","xdot","svg");
	private static final ImmutableList<String> algorithms = ImmutableList.of("circo","dot","fdp","neato","twopi");

	private static String getCommand(String name) throws ConfigurationException {
		return Core.getInstance().getConfigurationService().getGraphvizPath() + "/" + name;
	}

	public static void dotToSVG(String dot, OutputStream out) throws EndUserException {
		convert(dot, "dot", "svg", out);
	}

	public static void dotToXDOT(String dot, OutputStream out) throws EndUserException {
		convert(dot, "dot", "png", out);
	}

	public static void dotToPNG(String dot, OutputStream out) throws EndUserException {
		convert(dot, "dot", "png", out);
	}

	public static void dotToJPG(String dot, OutputStream out) throws EndUserException {
		convert(dot, "dot", "png", out);
	}

	public static void convert(String dot, String algorithm, String format, OutputStream out) throws EndUserException {
		if (!formats.contains(format) || !algorithms.contains(algorithm)) {
			throw new EndUserException("Format/algorithm not supported: "+format+"/"+algorithm);
		}
		try {
			File file = File.createTempFile(GraphUtil.class.getCanonicalName(), "."+format);
			File dotFile = File.createTempFile(GraphUtil.class.getCanonicalName(), ".dot");
			FileUtils.writeStringToFile(dotFile, dot, "UTF-8");
			String cmd = getCommand(algorithm) + "  -T"+format+" " + dotFile.getCanonicalPath() + " -o " + file.getCanonicalPath();
			log.debug(cmd);
			execute(cmd);
			FileInputStream input = new FileInputStream(file);
			IOUtils.copy(input, out);
			input.close();
			file.delete();
		} catch (IOException e) {
			throw new EndUserException(e);
		}
	}
}
