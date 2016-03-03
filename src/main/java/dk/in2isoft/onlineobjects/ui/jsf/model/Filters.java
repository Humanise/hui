package dk.in2isoft.onlineobjects.ui.jsf.model;

import java.util.ArrayList;
import java.util.List;

public class Filters {

	public enum Variant {index,block};
	private List<Filter> filters;
	
	public Filters() {
		filters = new ArrayList<>();
	}
	
	public List<Filter> getFilters() {
		return filters;
	}

	public void setFilters(List<Filter> filters) {
		this.filters = filters;
	}

	public Filter addFilter(String label, List<Option> options) {
		Filter filter = new Filter(label,options);
		filters.add(filter);
		return filter;
	}

	public static class Filter {
		private List<Option> options;
		private Variant variant;
		private String label;
		private String title;
		private boolean active;

		public Filter(List<Option> options) {
			this.options = options;
			this.variant = Variant.block;
		}

		public Filter(String label, List<Option> options) {
			this(options);
			this.label = label;
		}

		public List<Option> getOptions() {
			return options;
		}

		public void setOptions(List<Option> options) {
			this.options = options;
		}

		public String getLabel() {
			return label;
		}

		public void setLabel(String label) {
			this.label = label;
		}

		public Variant getVariant() {
			return variant;
		}

		public void setVariant(Variant variant) {
			this.variant = variant;
		}

		public String getTitle() {
			return title;
		}

		public void setTitle(String title) {
			this.title = title;
		}

		public boolean isActive() {
			return active;
		}

		public void setActive(boolean active) {
			this.active = active;
		}
	}

	public void addFilter(Filter filter) {
		filters.add(filter);
	}
}
