package dk.in2isoft.onlineobjects.modules.pipes;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

import au.com.bytecode.opencsv.CSVReader;

public class CSVParserStage extends PipelineStageAdapter {

	public CSVParserStage() {

	}

	@Override
	public void receiveFile(File file) {
		InputStreamReader inputStreamReader;
		CSVReader reader = null;
		try {
			inputStreamReader = new InputStreamReader(new FileInputStream(file), "UTF-8");
			BufferedReader buffered = new BufferedReader(inputStreamReader);
			reader = new CSVReader(buffered);

			Map<String, String> map = new LinkedHashMap<String, String>();
			String[] keys = {};
			String [] nextLine;
			int num = 1;
			while ((nextLine = reader.readNext()) != null) {
				if (num==1) {
					keys = nextLine;
					context.forwardMappedLineKeys(nextLine);
				} else if (nextLine.length==keys.length){
					for (int i = 0; i < nextLine.length; i++) {
						map.put(keys[i], nextLine[i]);
					}
					context.forwardMappedLine(map);
				} else {
					context.warn(this,"line "+num+": key length ("+keys.length+") and line length ("+nextLine.length+") does not match: "+Arrays.toString(nextLine));
				}
				num++;
				
			}
		} catch (IOException e) {
			
		} finally {
			if (reader!=null) {
				try {
					reader.close();
				} catch (IOException e) {
					// ignore
				}
			}
		}
	}

}
