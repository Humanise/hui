package dk.in2isoft.onlineobjects.modules.language;

import java.util.List;

import dk.in2isoft.onlineobjects.ui.jsf.model.Option;

public class LanguageStatistic {

	private String header;
	private String code;
	private int total;
	private List<Option> categories;

	public String getHeader() {
		return header;
	}

	public void setHeader(String header) {
		this.header = header;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
	}

	public List<Option> getCategories() {
		return categories;
	}

	public void setCategories(List<Option> categories) {
		this.categories = categories;
	}
}
