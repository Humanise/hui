package dk.in2isoft.in2igui.data;

public class FinderConfiguration {

	private String url;
	private String title;
	private String selectionUrl;
	private String selectionValue;
	private String selectionParameter;
	private FinderListConfiguration list;
	private FinderSearchConfiguration search;
	
	public FinderConfiguration() {
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setListUrl(String listUrl) {
		if (list==null) {
			list = new FinderListConfiguration();
		}
		list.setUrl(listUrl);
	}

	public String getSelectionUrl() {
		return selectionUrl;
	}

	public void setSelectionUrl(String selectionUrl) {
		this.selectionUrl = selectionUrl;
	}

	public String getSelectionValue() {
		return selectionValue;
	}

	public void setSelectionValue(String selectionValue) {
		this.selectionValue = selectionValue;
	}

	public String getSelectionParameter() {
		return selectionParameter;
	}

	public void setSelectionParameter(String selectionParameter) {
		this.selectionParameter = selectionParameter;
	}

	public void setSearchParameter(String searchParameter) {
		if (this.search == null) {
			search = new FinderSearchConfiguration();
		}
		this.search.setParameter(searchParameter);
	}

	public FinderSearchConfiguration getSearch() {
		return search;
	}
	
	public FinderListConfiguration getList() {
		return list;
	}

	public class FinderListConfiguration {
		private String url;

		public String getUrl() {
			return url;
		}

		public void setUrl(String url) {
			this.url = url;
		}
	}
	
	public class FinderSearchConfiguration {
		private String parameter;

		public String getParameter() {
			return parameter;
		}

		public void setParameter(String parameter) {
			this.parameter = parameter;
		}
	}
}
