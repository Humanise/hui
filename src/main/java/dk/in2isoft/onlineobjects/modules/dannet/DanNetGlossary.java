package dk.in2isoft.onlineobjects.modules.dannet;

import java.util.List;

import com.google.common.collect.Lists;

public class DanNetGlossary {

	private String glossary;
	
	private List<String> examples = Lists.newArrayList();

	public void setGlossary(String glossary) {
		this.glossary = glossary;
	}

	public String getGlossary() {
		return glossary;
	}

	public List<String> getExamples() {
		return examples;
	}
}
