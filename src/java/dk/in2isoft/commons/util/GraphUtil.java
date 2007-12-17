package dk.in2isoft.commons.util;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStream;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;

import dk.in2isoft.onlineobjects.core.ConfigurationException;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.EndUserException;

public class GraphUtil extends AbstractCommandLineInterfaceUtil {

	private static Logger log = Logger.getLogger(GraphUtil.class);
	
	private static String getCommand(String name) throws ConfigurationException {
		return Core.getInstance().getConfiguration().getGraphvizPath()+"/"+name;
	}

	public static String dotToSvg(String dot) throws EndUserException {
		log.debug(dot);
		StringBuilder result = new StringBuilder();
		try {
			File svgFile = File.createTempFile(GraphUtil.class.getCanonicalName(), ".svg");
			File dotFile = File.createTempFile(GraphUtil.class.getCanonicalName(), ".dot");
			FileUtils.writeStringToFile(dotFile, dot, "UTF-8");
			String cmd = getCommand("fdp")+"  -Tsvg " + dotFile.getCanonicalPath() + " -o "
					+ svgFile.getCanonicalPath();
			execute(cmd);

			BufferedReader in = new BufferedReader(new FileReader(svgFile));
			String str;
			while ((str = in.readLine()) != null) {
				result.append(str);
			}
			in.close();
			return result.toString();
		} catch (IOException e) {
			throw new EndUserException(e);
		}
	}

	public static String dotToDot(String dot) throws EndUserException {
		log.debug(dot);
		StringBuilder result = new StringBuilder();
		try {
			File svgFile = File.createTempFile(GraphUtil.class.getCanonicalName(), ".svg");
			File dotFile = File.createTempFile(GraphUtil.class.getCanonicalName(), ".dot");
			FileUtils.writeStringToFile(dotFile, dot, "UTF-8");
			String cmd = getCommand("neato")+" -Txdot " + dotFile.getCanonicalPath() + " -o "
					+ svgFile.getCanonicalPath();
			execute(cmd);

			BufferedReader in = new BufferedReader(new FileReader(svgFile));
			String str;
			while ((str = in.readLine()) != null) {
				result.append(str);
				result.append("\n");
			}
			in.close();
			return result.toString();
		} catch (IOException e) {
			throw new EndUserException(e);
		}
	}

	public static String dotToPNG(String dot, OutputStream out) throws EndUserException {
		StringBuilder result = new StringBuilder();
		try {
			File png = File.createTempFile(GraphUtil.class.getCanonicalName(), ".png");
			File dotFile = File.createTempFile(GraphUtil.class.getCanonicalName(), ".dot");
			FileUtils.writeStringToFile(dotFile, dot, "UTF-8");
			String cmd = getCommand("fdp")+"  -Tpng " + dotFile.getCanonicalPath() + " -o " + png.getCanonicalPath();
			execute(cmd);
			BufferedInputStream buf = null;
			try {
				buf = new BufferedInputStream(new FileInputStream(png));
				int readBytes = 0;
				while ((readBytes = buf.read()) != -1) {
					out.write(readBytes);
				}
			} catch (IOException ioe) {
				throw new EndUserException(ioe.getMessage());
			} finally {
				if (out != null)
					out.close();
				if (buf != null)
					buf.close();
			}
			return result.toString();
		} catch (IOException e) {
			throw new EndUserException(e);
		}
	}
}
