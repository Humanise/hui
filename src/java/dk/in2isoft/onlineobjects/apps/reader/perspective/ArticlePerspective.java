package dk.in2isoft.onlineobjects.apps.reader.perspective;

import java.util.List;

import dk.in2isoft.onlineobjects.core.Pair;
import dk.in2isoft.onlineobjects.ui.data.Option;

public class ArticlePerspective {

	private long id;
	private String title;
	private String rendering;
	private String info;
	private List<Pair<Long,String>> quotes;
	private List<Option> tags;
	private List<Option> words;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getRendering() {
		return rendering;
	}

	public void setRendering(String rendering) {
		this.rendering = rendering;
	}

	public List<Option> getTags() {
		return tags;
	}

	public void setTags(List<Option> tags) {
		this.tags = tags;
	}

	public List<Option> getWords() {
		return words;
	}

	public void setWords(List<Option> words) {
		this.words = words;
	}

	public String getInfo() {
		return info;
	}

	public void setInfo(String info) {
		this.info = info;
	}

	public List<Pair<Long,String>> getQuotes() {
		return quotes;
	}

	public void setQuotes(List<Pair<Long,String>> quotes) {
		this.quotes = quotes;
	}
	
}
