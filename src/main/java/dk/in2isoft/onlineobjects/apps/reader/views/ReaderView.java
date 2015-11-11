package dk.in2isoft.onlineobjects.apps.reader.views;

import java.util.List;
import java.util.Map.Entry;

import org.springframework.beans.factory.InitializingBean;

import com.google.common.collect.Lists;

import dk.in2isoft.commons.jsf.AbstractView;
import dk.in2isoft.onlineobjects.apps.reader.perspective.InternetAddressViewPerspectiveBuilder;
import dk.in2isoft.onlineobjects.modules.information.ContentExtractor;
import dk.in2isoft.onlineobjects.ui.jsf.model.Option;

public class ReaderView extends AbstractView implements InitializingBean {
	
	private InternetAddressViewPerspectiveBuilder builder;
	
	private String extractionAlgorithm;

	private List<Option> extractionOptions;
	
	@Override
	public void afterPropertiesSet() throws Exception {
		extractionOptions = Lists.newArrayList();
		for (Entry<String, ContentExtractor> ex : builder.getContentExtractors().entrySet()) {
			String value = ex.getKey();
			if (extractionAlgorithm==null) {
				extractionAlgorithm = value;
			}
			extractionOptions.add(new Option(value,value));
		}

	}
	
	public String getExtractionAlgorithm() {
		return extractionAlgorithm;
	}

	public List<Option> getExtractionAlgorithms() {
		return extractionOptions;
	}
	
	public void setBuilder(InternetAddressViewPerspectiveBuilder builder) {
		this.builder = builder;
	}
}
